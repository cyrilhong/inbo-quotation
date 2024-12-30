import React, { useEffect, useState } from "react";
import './App.css';
import Button from '@mui/material/Button';
import ShoplineButtonFrame from "./ShoplineButtonFrame";
// import productsData from "./data/products.json";
import styled from '@emotion/styled';
import Product from "./components/product";
import Filter from "./components/filter";
import { mediaQueries } from "./variables";
import axios from 'axios';
function App() {
  const [productsData, setProductsData] = useState([]);

  const [userMemberTier, setUserMemberTier] = useState(null)
  const [listView, setListView] = useState(true);
  const [memberTier, setMemberTier] = useState([]);

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
          setUserMemberTier(response.data.items[0].membership_tier);
        } catch (error) {
          console.error('Error fetching products:', error);
        }
      }
    };

    fetchCustomerData();
  }, []);



  return (
    <div className="App">
      <Filter setListView={setListView} setProductsData={setProductsData} setGlobalMemberTier={setMemberTier} />
      {/* {JSON.stringify(memberTier)} */}
      <ProductList listView={listView}>
        {/* <ShoplineButtonFrame /> */}
        {/* {JSON.stringify(productsData)} */}
        {productsData?.map((product, index) => (
          <div key={index}>
            <Product
              props={product}
              key={product.id}
              imageUrl={product.medias[0].images.original.url}
              titleZh={product.title_translations['zh-hant']}
              titleEng={product.title_translations['en']}
              memberTier={memberTier}
              listView={listView} // 在渲染時傳遞最新值
              product_price_tiers={product.product_price_tiers}
              desc={product.seo_description_translations['zh-hant']}
              userMemberTier={userMemberTier}
            />
          </div>
        ))}
      </ProductList>
    </div>
  );
}

export default App;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: ${props => props.listView ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)'};
  gap: 16px;
  /* padding: 16px; */

  ${mediaQueries.tablet} {
    grid-template-columns: ${props => props.listView ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'};
  }

  ${mediaQueries.mobile} {
    grid-template-columns: repeat(1, 1fr);
  }
`;