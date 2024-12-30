import React, { useEffect, useState, } from 'react'
import styled from '@emotion/styled';
import axios from 'axios';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AppsIcon from '@mui/icons-material/Apps';
import TextField from '@mui/material/TextField';
import { colors, mediaQueries } from '../variables';
import Button from '@mui/material/Button';
import Autocomplete from '@mui/material/Autocomplete';
import downloadComponentInPDF from './savePDF';
import BeatLoader from "react-spinners/BeatLoader";
import useResizeObserver from '../hooks/useResizeObserver';
const Filter = ({ setListView, setProductsData, setGlobalMemberTier, setGlobalProcessing }) => {
    const [tags, setTags] = useState([]);
    const [listView, setLocalListView] = useState(true)
    const [nationCategory, setNationCategory] = useState([]);
    const [processCategory, setProcessCategory] = useState([]);
    const [nation, setNation] = React.useState([])
    const [processing, setProcessing] = React.useState([])
    const [searchTerm, setSearchTerm] = useState('');
    const [allProducts, setAllProducts] = useState([])
    const [memberTier, setMemberTier] = useState([])
    const [currentSearchResults, setCurrentSearchResults] = useState([]);
    const [loading, setLoading] = useState(false);
    const handleListView = (event, nextListView) => {
        const validListView = nextListView === true || nextListView === false ? nextListView : true; // Ensure it's a boolean
        setLocalListView(validListView);
        setListView(validListView);
    };


    const handleNationChange = (newChips) => {
        setNation(newChips)
    }
    const handleProcessingChange = (newChips) => {
        setProcessing(newChips)
    }
    const handleSearchChange = () => {
        const filteredProducts = allProducts.filter(product => {
            return (searchTerm.length === 0 ||
                searchTerm.some(term => {
                    const seoKeywords = Array.isArray(product.seo_keywords) ? product.seo_keywords : [product.seo_keywords];
                    return seoKeywords.some(tag => tag && tag.toLowerCase().includes(term.toLowerCase())) ||
                        (product.tags && product.tags.some(tag => tag.toLowerCase().includes(term.toLowerCase()))) ||
                        product.title_translations['zh-hant'].toLowerCase().includes(term.toLowerCase());
                })) &&
                (Array.isArray(processing) && processing.length === 0 ||
                    processing.some(proc => {
                        const productIds = proc.products.map(p => p.id);
                        return productIds.includes(product.id);
                    })) &&
                (Array.isArray(nation) && nation.length === 0 ||
                    nation.some(nat => {
                        return nat.products.some(nationProduct => nationProduct.id === product.id);
                    }));
        });
        // console.log(filteredProducts);
        // debugger
        setProductsData(filteredProducts);
        setCurrentSearchResults(filteredProducts);
    };

    

    const fetchProducts = async () => {
        setLoading(true); // Start loading
        try {
            const nationResult = await searchByNation();
            const processResult = await searchByProcess();
            const response = await axios.get('/v1/products', {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
                },
                params: {
                    per_page: 200,
                },
            });

            const priceTierMap = {};
            const validProducts = response.data.items.filter(product => {
                return product.product_price_tiers.length > 0 &&
                    product.product_price_tiers.some(priceTier => priceTier.variation_key !== null);
            });

            // Populate the priceTierMap with valid products
            validProducts.forEach(product => {
                product.product_price_tiers.forEach(priceTier => {
                    priceTierMap[priceTier.variation_key] = {
                        ...priceTier,
                        tierName: null // Initialize tierName as null
                    };
                });
            });

            const updatedProducts = response.data.items.map(product => {
                // Filter valid product_price_tiers
                product.product_price_tiers = product.product_price_tiers.filter(priceTier => priceTier.variation_key);
                // Add nation and processing method based on filter_tags
                const nationTag = nationResult && nationResult.length > 0 ?
                    product.filter_tags.find(tag => {
                        return nationResult.some(nation =>
                            tag.name_translations["zh-hant"] === nation.title
                        )
                    }
                    ) : null;

                const processTag = processResult && processResult.length > 0 ?
                    product.filter_tags.find(tag =>
                        processResult.some(process =>
                            tag.name_translations["zh-hant"] === process.title
                        )
                    ) : null;

                if (nationTag) {
                    product.nation = nationTag; // Add nation
                }
                // console.log(nationTag);


                if (processTag) {
                    product.processing = processTag.name_translations?.["zh-hant"]; // Add processing method
                }


                // Update product_price_tiers
                product.product_price_tiers.forEach(priceTier => {
                    const matchingVariation = product.variations.find(variation => variation.id === priceTier.variation_key);
                    if (matchingVariation) {
                        priceTier.variation_details = matchingVariation;

                        if (matchingVariation.weight > 0) {
                            priceTier.member_price.avg_price = Math.round(priceTier.member_price.dollars / matchingVariation.weight);
                        } else {
                            priceTier.member_price.avg_price = null; // Handle invalid weight
                        }
                    }

                    const matchingTier = memberTier.find(tier => tier.id === priceTier.membership_tier_id);
                    if (matchingTier) {
                        priceTier.membership_tier_data = matchingTier;
                    }
                });
                // console.log(product.processing);
                // console.log(product.nation);

                return product;
            });

            const allTags = response.data.items
                .flatMap(product => product.tags)
                .filter((tag, index, self) => self.indexOf(tag) === index);

            const filteredProducts = updatedProducts.filter(product => product.status === "active" && product.quantity > 0 && product.product_price_tiers.length > 0);
            setTags(allTags);
            setProductsData(filteredProducts);
            setAllProducts(filteredProducts);
            setCurrentSearchResults(filteredProducts);
            setTimeout(() => {
                const iframeHeight = document.body.scrollHeight;
                console.log('====================================');
                console.log(iframeHeight);
                console.log('====================================');
                window.parent.postMessage({ iframeHeight }, '*');
            }, 300); 
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false); // Finish loading
        }
    };

    const fetchProductsByCategory = async (nation) => {
        try {
            const response = await axios.get(`/v1/products/search?category_id=${nation.id}`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
                }
            });

            // console.log('分類產品:', response.data.items);
            return response.data.items;
        } catch (error) {
            console.error('Error fetching products by category:', error);
        }
    };

    const searchByNation = async () => {
        try {
            const categoryResponse = await axios.get(`/v1/categories/62c680be6b88140023b63db0`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
                }
            });

            const nationList = categoryResponse.data.children.map(child => ({
                id: child.id,
                title: child.name_translations['zh-hant'] // 獲取中文名稱
            }));

            const responses = await Promise.all(nationList.map(nation =>
                fetchProductsByCategory(nation)
            ));
            // console.log(responses);

            const updatedNationList = nationList.map((nation, index) => ({
                ...nation,
                products: (responses[index] || []).filter(product => product.status === "active" && product.quantity > 0)
                    .map(({ id, title_translations }) => ({ id, title_translations })) // Keep id and title_translations
            })).filter(nation => nation.products.length > 0);

            setNationCategory(updatedNationList); // 將結果存入 nationCategory 狀態
            return updatedNationList;

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };
    const getMemberTier = async () => {
        try {
            const response = await axios.get(`v1/membership_tiers`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
                }
            });

            console.log('會員等級:', response.data);
            setMemberTier(response.data);
            setGlobalMemberTier(response.data);
            return response.data;
        } catch (error) {
            console.error('Error fetching products by category:', error);
        }
    };

    const searchByProcess = async () => {
        try {
            const categoryResponse = await axios.get(`/v1/categories/62c5b16078315b002645e04a`, {
                headers: {
                    Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
                }
            });

            const processList = categoryResponse.data.children.map(child => ({
                id: child.id,
                title: child.name_translations['zh-hant']
            }));

            const responses = await Promise.all(processList.map(process =>
                fetchProductsByCategory(process)
            ));
            // console.log(responses);

            const updatedProcessList = processList.map((process, index) => ({
                ...process,
                products: (responses[index] || []).filter(product => product.status === "active" && product.quantity > 0)
                    .map(({ id, title_translations }) => ({ id, title_translations }))
            })).filter(process => process.products.length > 0);
            // debugger
            setProcessCategory(updatedProcessList);
            setGlobalProcessing(updatedProcessList);

            return updatedProcessList;

        } catch (error) {
            console.error('Error fetching products:', error);
        }
    };

    useResizeObserver();
    useEffect(() => {
        fetchProducts();
        getMemberTier();
    }, []);


    const handleDownload = async () => {
        // Step 1: 備份當前的 `productsData`
        const backup = [...currentSearchResults]; // 深拷貝當前資料
        // console.log("Backup created:", backup);

        // Step 2: 切換到所有產品
        setProductsData([...allProducts]); // 設定為全部產品
        // console.log("Switched to all products:", allProducts);

        // 等待 React 更新狀態
        await new Promise(resolve => setTimeout(resolve, 100));

        // Step 3: 下載 PDF
        try {
            const el = document.getElementById("root");
            await downloadComponentInPDF(el);
        } catch (error) {
            console.error("Error during PDF download:", error);
        }

        // Step 4: 恢復原本的資料
        setProductsData(backup); // 恢復為原始的資料
    };
    const cssOverride = {
        display: "block",
        margin: "0 auto",
        borderColor: colors.cta,
    };
    return (
        <Wrapper className='filter'>
            <ModalWrapper
                loading={loading}
            >
                <BeatLoader
                    color={colors.white}
                    loading={loading}
                    cssOverride={cssOverride}
                    size={30}
                />
            </ModalWrapper>
            <div className="upper">
                <Button
                    variant="contained"
                    sx={{ backgroundColor: colors.orange, color: 'white' }}
                    size={window.innerWidth < 768 ? 'small' : 'large'}
                    onClick={handleDownload}
                >
                    下載豆單
                </Button>
            </div>
            <div className="lower">
                <div className="row">
                    <div className="toggler">
                        <label>
                            顯示方式
                        </label>
                        <ToggleButtonGroup

                            value={listView}
                            exclusive
                            onChange={handleListView}
                        >
                            <ToggleButton
                                value={true}
                                size='small'
                                sx={{
                                    backgroundColor: listView ? colors.primary : 'initial',
                                    color: listView ? colors.white : colors.black,
                                    '&.Mui-selected': {
                                        backgroundColor: colors.primary,
                                        color: colors.white,
                                    },
                                    '&:hover': {
                                        backgroundColor: listView ? colors.primary : 'initial', // No change on hover
                                        color: listView ? colors.white : colors.black, // Maintain text color on hover
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: colors.primary, // Override hover effect for selected button
                                        color: colors.white,
                                    },
                                }}
                                selected={listView}
                            >
                                <FormatListBulletedIcon />
                            </ToggleButton>
                            <ToggleButton
                                value={false}
                                size='small'
                                sx={{
                                    backgroundColor: !listView ? colors.primary : 'initial',
                                    color: !listView ? colors.white : colors.black,
                                    '&.Mui-selected': {
                                        backgroundColor: colors.primary,
                                        color: colors.white,
                                    },
                                    '&:hover': {
                                        backgroundColor: !listView ? colors.primary : 'initial', // No change on hover
                                        color: !listView ? colors.white : colors.black, // Maintain text color on hover
                                    },
                                    '&.Mui-selected:hover': {
                                        backgroundColor: colors.primary, // Override hover effect for selected button
                                        color: colors.white,
                                    },
                                }}
                                selected={!listView}
                            >
                                <AppsIcon />
                            </ToggleButton>
                        </ToggleButtonGroup>
                    </div>
                    {/* <div className="price">
                    <label>
                        價格(NT$)/公斤
                    </label>
                    <div className="price-section">
                        <TextField
                            type="number"
                            placeholder='最小金額'
                            size='small'
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                        ~
                        <TextField
                            type="number"
                            placeholder='最大金額'
                            size='small'
                            slotProps={{
                                inputLabel: {
                                    shrink: true,
                                },
                            }}
                        />
                    </div>
                </div> */}
                    <div className="nation">
                        <label>
                            國家產區
                        </label>
                        <Autocomplete
                            multiple
                            options={nationCategory}
                            getOptionLabel={(nationCategory) => nationCategory.title}
                            defaultValue={[]}
                            onChange={(event, newValue) => {
                                handleNationChange(newValue);
                            }}
                            size='small'
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    size='small'
                                    label=""
                                    placeholder="輸入國家"
                                />
                            )}
                        />
                    </div>
                    <div className="processing">
                        <label>
                            處理法
                        </label>
                        <Autocomplete
                            multiple
                            options={processCategory}
                            getOptionLabel={(processCategory) => processCategory.title}
                            defaultValue={[]}
                            onChange={(event, newValue) => {
                                handleProcessingChange(newValue);
                            }}
                            size='small'
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    size='small'
                                    label=""
                                    placeholder="輸入處理法"
                                />
                            )}
                        />
                    </div>
                </div>
                <div className="row">
                    <div className="tag">
                        {/* {JSON.stringify(tags)} */}
                        <label>
                            關鍵字搜尋
                        </label>
                        <Autocomplete
                            multiple
                            freeSolo
                            options={tags}
                            getOptionLabel={(option) => option}
                            defaultValue={[]}
                            size='small'
                            onChange={(event, newValue) => {
                                setSearchTerm(newValue);
                            }}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    size='small'
                                    label=""
                                    placeholder="輸入關鍵字..."
                                />
                            )}
                        />
                    </div>
                    <div className="search">
                        <Button
                            variant="contained"
                            onClick={handleSearchChange}
                            sx={{ backgroundColor: colors.cta, color: colors.white }}
                            size='medium'
                        >
                            搜尋
                        </Button>
                    </div>
                </div>
            </div>
            {/* nation: {JSON.stringify(nationCategory)} <br /> */}
            {/* processing: {JSON.stringify(processCategory)}<br /> */}
            {/* searchTerm: {JSON.stringify(searchTerm)} */}
        </Wrapper>
    )
}

export default Filter;

const Wrapper = styled.div`
    display: flex;
    flex-direction: column;
    align-items: start;
    justify-content: start;
    gap: 16px;
    label{
        font-size: 16px;
    }
    .toggler{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
        .Mui-selected{
            pointer-events: none;
        }
    }
    .price{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
        .price-section{
            gap: 12px;
            display: flex;
            flex-direction: row;
            align-items: center;
            width: 100%;
        }
    }
    .nation{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
        .MuiAutocomplete-root{
            width: 100%;
        }
    }
    .processing{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
        .MuiAutocomplete-root{
            width: 100%;
        }
    }
    .tag{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
        .MuiAutocomplete-root{
            width: 100%;
        }
    }
    .search{
        margin-top: 36px;
    }
    .upper{
        display: flex;
        justify-content: flex-end; // Aligns items to the right
        width: 100%; // Ensures it takes full width
        button{
            /* position: absolute;
            right: 0; */
        }
    }
    .lower{
        display: flex;
        flex-direction: row;
        align-items: start;
        gap: 12px;
        width: 100%;
        margin-bottom: 16px;
        .price,.nation,.processing,.tag{
            flex-grow: 1;
        }
        .price-section{
            .MuiTextField-root{
                flex-grow: 1;
            }
        }
        .nation,.processing,.tag{
            .MuiTextField-root{
                width: 100%;
            }
        }
        .row{
            display: flex;
            flex-direction: row;
            gap: 12px;
            width: 100%;
        }
    }
    ${mediaQueries.tablet}{
        .lower{
            flex-direction: column;
            label{
                font-size: 10px;
            }
            gap: 12px;
        }
        .search{
            margin-top: 26px;
        }
        .upper{
            position: fixed;
            z-index: 100;
            right: 20px;
        }
        .lower{
            margin-top: 40px;
        }
    }
`

const ModalWrapper = styled.div`
    position: fixed;
    pointer-events: none;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    transition: opacity 0.3s ease-in-out;
    opacity: ${props => props.loading ? 1 : 0};
    background-color: rgba(0, 0, 0, 0.5); /* Black with transparency */
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1000; /* Ensure it's on top */
`;