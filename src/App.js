import React, { useEffect, useState } from "react";
import './App.css';
import ShoplineButtonFrame from "./ShoplineButtonFrame";
import { getName, getCode } from 'country-list';
import styled from '@emotion/styled';
import Product from "./components/product";
import Filter from "./components/filter";
import { mediaQueries } from "./variables";
import axios from 'axios';
import ReactCountryFlag from "react-country-flag"
import Box from '@mui/material/Box';
function App() {
  const [productsData, setProductsData] = useState([]);

  const [userMemberTier, setUserMemberTier] = useState(null)
  const [listView, setListView] = useState(true);
  const [memberTier, setMemberTier] = useState([]);
  const [globalProcessing, setGlobalProcessing] = useState([]);
  useEffect(() => {
    const fetchCustomerData = async () => {
      const queryParams = new URLSearchParams(window.location.search);
      const emailFromURL = queryParams.get("email");
      if (emailFromURL) {
        try {
          const response = await axios.get(`/v1/customers/search?email=${emailFromURL}`, {
            headers: {
              Authorization: `Bearer ${process.env.REACT_APP_BEARER_TOKEN}`
            }
          });
          console.log(response.data);
          setUserMemberTier(response.data.items[0].membership_tier);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchCustomerData();
  }, []);


  const sortedProducts = productsData?.sort((a, b) => {
    if (a.nation === '衣索比亞' && b.nation !== '衣索比亞') {
      return -1; // a comes first
    }
    if (a.nation !== '衣索比亞' && b.nation === '衣索比亞') {
      return 1; // b comes first
    }
    return 0; // keep original order for other nations
  });

  const processingTitles = globalProcessing.map(process => process.title);

  const groupedProducts = sortedProducts?.reduce((acc, product) => {
    const nation = product.nation?.name_translations['zh-hant'] || 'Unknown'; // Access the nation name
    const processingMethod = product.processing || 'Unknown'; // Handle case where processing might be undefined

    // Initialize the nation group if it doesn't exist
    if (!acc[nation]) {
      acc[nation] = {};
    }

    // Initialize the processing method group if it doesn't exist
    if (!acc[nation][processingMethod]) {
      acc[nation][processingMethod] = [];
    }

    // Add the product to the appropriate processing method group
    acc[nation][processingMethod].push(product);
    return acc;
  }, {});

  const finalProductsArray = Object.entries(groupedProducts || {}).flatMap(([nation, processingGroups]) => {
    // Sort processing methods based on defined order
    const sortedProcessingMethods = Object.keys(processingGroups).sort((a, b) => {
      return processingTitles.indexOf(a) - processingTitles.indexOf(b);
    });

    // Flatten the sorted groups into a single array
    return sortedProcessingMethods.flatMap(method => processingGroups[method]);
  });

  const renderProducts = () => {
    let currentNation = null;
    let currentProcessing = null;
  
    return finalProductsArray.map((product, index) => {
      const nation = product.nation || 'Unknown';
      const processing = product.processing || 'Unknown';
  
      const showNation = currentNation?.name_translations?.['zh-hant'] !== nation.name_translations?.['zh-hant'];
      const showProcessing = currentProcessing !== processing;
  
      if (showNation) currentNation = nation;
      if (showNation || showProcessing) currentProcessing = processing;
  
      return (
        <>
          {showNation && (
            <StyledNation key={`nation-${index}`} className="full-width">
              <ReactCountryFlag
                countryCode={getCode(nation?.name_translations?.en?nation?.name_translations?.en:'Unknown')}
                svg
                style={{ marginRight: '8px' }}
              />
              {nation?.name_translations?.['zh-hant']}
            </StyledNation>
          )}
          {showProcessing && (
            <StyledProcessing key={`processing-${index}`} className="full-width">
              {processing}
            </StyledProcessing>
          )}
          <StyledProduct key={product.id} listView={listView}>
            <Product
              props={product}
              imageUrl={product.medias[0].images.original.url}
              titleZh={product.title_translations['zh-hant']}
              titleEng={product.title_translations['en']}
              memberTier={memberTier}
              listView={listView}
              product_price_tiers={product.product_price_tiers}
              desc={product.seo_description_translations['zh-hant']}
              userMemberTier={userMemberTier}
            />
          </StyledProduct>
        </>
      );
    });
  };
  return (
    <div className="App">
      <Filter setListView={setListView} setProductsData={setProductsData} setGlobalMemberTier={setMemberTier} setGlobalProcessing={setGlobalProcessing} />

      <ProductList listView={listView}>
        {renderProducts()}
      </ProductList>
    </div>
  );
}

export default App;

const StyledNation = styled.div`
  grid-column: span 3; /* 在三列布局時，占據整行 */
  text-align: left;
  ${mediaQueries.tablet} {
    grid-column: span 2; /* 在兩列布局時，占據整行 */
  }
  ${mediaQueries.mobile} {
    grid-column: span 1; /* 在單列布局時，占據整行 */
  }
  font-weight: bold;
  display: flex;
  align-items: center;
`;

const StyledProcessing = styled.div`
  grid-column: span 3; /* 在三列布局時，占據整行 */
  text-align: left;
  font-weight: bold;
  ${mediaQueries.tablet} {
    grid-column: span 2; /* 在兩列布局時，占據整行 */
  }
  ${mediaQueries.mobile} {
    grid-column: 1; /* 在單列布局時，占據整行 */
  }
  font-size: 1rem;
  color: gray;
`;

const StyledProduct = styled.div`
  display: flex;
  flex-direction: ${props => (props.listView ? 'row' : 'column')}; /* listView 模式為橫向佈局 */
  align-items: ${props => (props.listView ? 'flex-start' : 'center')};
  justify-content: space-between;
  gap: 16px;
  width: 100%;
  box-sizing: border-box; /* 確保內邊距不影響寬度計算 */
  grid-column: ${props => (props.listView ? 'span 3' : 'span 1')}; /* 在三列布局時，占據整行 */
  .product-image {
    flex: ${props => (props.listView ? '0 0 150px' : '1 1 auto')}; /* listView 模式下圖片固定寬度 */
    height: auto;
  }

  .product-info {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    width: 100%; /* 保證產品信息佔滿剩餘空間 */
  }
`;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: ${props => (props.listView ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)')}; /* listView 模式為單列 */
  gap: 16px;
  column-gap: 50px;

  ${mediaQueries.tablet} {
    grid-template-columns: ${props => (props.listView ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)')}; /* 平板模式下處理 */
  }

  ${mediaQueries.mobile} {
    grid-template-columns: repeat(1, 1fr); /* 手機模式固定單列 */
  }
`;