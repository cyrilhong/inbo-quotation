import React, { Component, useState } from 'react'
import styled from '@emotion/styled';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import AppsIcon from '@mui/icons-material/Apps';
import TextField from '@mui/material/TextField';
import { MuiChipsInput } from 'mui-chips-input'
import { colors } from '../variables';
import Button from '@mui/material/Button';
export default function Filter({setListView}) {
    const [listView, setLocalListView] = useState(true)
    const handleListView = (event, nextListView) => {
        setLocalListView(nextListView);
        setListView(nextListView); // Call the function passed from the parent
    };
    const [nation, setNation] = React.useState([])
    const [processing, setProcessing] = React.useState([])
    const [searchTerm, setSearchTerm] = useState('');
    

    const handleNationChange = (newChips) => {
        setNation(newChips)
    }
    const handleProcessingChange = (newChips) => {
        setProcessing(newChips)
    }
    const handleSearchChange = (event) => {
        setSearchTerm(event.target.value); // Update search term
    };
    return (
        <Wrapper className='filter'>
            <div className="upper">
                <Button
                    variant="contained"
                    sx={{ backgroundColor: colors.orange, color: 'white' }}
                    size='large'
                >
                    下載豆單
                </Button>
            </div>
            <div className="lower">
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
                <div className="price">
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
                </div>
                <div className="nation">
                    <label>
                        國家產區
                    </label>
                    <MuiChipsInput
                        value={nation}
                        onChange={handleNationChange}
                        size='small'
                    />
                </div>
                <div className="processing">
                    <label>
                        處理法
                    </label>
                    <MuiChipsInput
                        value={processing}
                        onChange={handleProcessingChange}
                        size='small'
                    />
                </div>
                <div className="tag">
                    <label>
                        關鍵字搜尋
                    </label>
                    <TextField
                        value={searchTerm}
                        onChange={handleSearchChange}
                        placeholder="輸入關鍵字..."
                        variant="outlined"
                        size='small'
                    />
                </div>
                <div className="search">
                    <Button
                        variant="contained"
                        sx={{ backgroundColor: colors.primary, color: colors.white }}
                        size='small'
                    >
                        搜尋
                    </Button>
                </div>
            </div>
        </Wrapper>
    )
}

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
    }
    .processing{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
    }
    .tag{
        display: flex;
        flex-direction: column;
        align-items: start;
        gap: 12px;
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
    }
`