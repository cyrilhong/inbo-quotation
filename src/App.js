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
  const [email, setEmail] = useState("");
  const [listView, setListView] = useState(true);
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get('https://open.shopline.io/v1/products', {
          headers: {
            Authorization: 'Bearer 043f0c91a381ffb6b47321c777f51f63644959af448702e217304f6f7785c0e0'
          }
        });
        // Filter and map the products in one step
        const products = response.data.items
          .filter(product => product.status !== "hidden") // Filter for active products and not hidden
          .map(product => (
            <Product
              key={product.id}
              imageUrl={product.medias[0].images.original.url} // Adjust this path based on your actual structure
              titleZh={product.title_translations['zh-hant']}
              titleEng={product.title_translations['en']}
              listView={listView}
              price={product.price.label} // Extracting the price label
            />
          ));
        setProductsData(products); // Store the mapped products
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();

    const queryParams = new URLSearchParams(window.location.search);
    const emailFromURL = queryParams.get("email");
    if (emailFromURL) {
      setEmail(emailFromURL);
    }
  }, []);

  const [title, setTitle] = useState({ zh: '', eng: '' });

  useEffect(() => {
    const titleTranslations = {
      "zh-hant": "薩爾瓦多 阿瓦查潘省 加比圖莊園 彩虹波旁 厭氧日曬 El Salvador Ahuachapán Gobiado Rainbow Bourbon Anaerobic Natural"
    };

    const match = titleTranslations["zh-hant"].match(/([\u4e00-\u9fa5\s()）（0-9元組入\/]+)(?:\s+([A-Za-z].*)|$)/);

    setTitle({
      zh: match ? match[1].trim() : titleTranslations["zh-hant"],
      eng: match ? (match[2] || '') : ''
    });
  }, []);


  return (
    <div className="App">
      <Filter setListView={setListView} />
      <ProductList listView={listView}>
        {productsData}
      </ProductList>
    </div>
  );
}

export default App;

const ProductList = styled.div`
  display: grid;
  grid-template-columns: ${props => props.listView ? 'repeat(1, 1fr)' : 'repeat(3, 1fr)'};
  gap: 16px;
  padding: 16px;

  ${mediaQueries.tablet} {
    grid-template-columns: ${props => props.listView ? 'repeat(1, 1fr)' : 'repeat(2, 1fr)'};
  }

  ${mediaQueries.mobile} {
    grid-template-columns: repeat(1, 1fr);
  }
`;