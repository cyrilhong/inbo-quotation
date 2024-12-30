import { useEffect, useState } from 'react';
import Cart from './img/cart.svg'
const ShoplineBuyButton = ({ variationId, productID }) => {
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    // This effect will run every time variationId or productID changes
    console.log('Variation ID:', variationId);
    console.log('Product ID:', productID);
    setIsLoading(true);

    // Load or render the button here using the new IDs
    loadShoplineButton(variationId, productID);

    setIsLoading(false);
  }, [variationId, productID]); // Dependencies array

  const loadShoplineButton = (variationId, productID) => {
    // Logic to load the Shopline button using the provided IDs
  };

  useEffect(() => {
    // console.log('Component mounted');

    document.addEventListener('click', function (event) {
      // console.log(event.target);

      // Check if the clicked element is a link
      if (event.target.tagName === 'A') {
        // console.log('A link was clicked:', event.target.href);

        if (event.target.href.includes('checkout')) {
          event.preventDefault(); // Prevent the default navigation
          // console.log('Checkout link clicked, but navigation prevented.');

          // Close the new window after a timeout (e.g., 5 seconds)
          // 等待按鈕渲染完成後插入圖片
          setTimeout(() => {
            const button = document.querySelector(".shopline-button-container button");
            if (button) {
              // 建立 img 元素
              const img = document.createElement('img');
              img.src = Cart; // 使用已引入的圖片資源
              img.alt = 'Cart Icon';
              img.style.marginRight = '8px'; // 設定圖片與文字間距
              img.style.height = '20px'; // 控制圖片高度
              img.style.verticalAlign = 'middle'; // 對齊文字

              // 將 img 插入到按鈕的開頭
              button.prepend(img);
            }
          }, 1000); // 延遲等待按鈕生成完成
        }
      }
    }, true); // Use capture phase to intercept events before they reach the target

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('click', this);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    // console.log('Component mounted');

    // Load Shopline SDK
    const loadSDK = () => {
      const existingScript = document.getElementById('shopline-buy-sdk');
      if (existingScript) {
        // console.log('Shopline SDK already loaded');
        renderButton();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://buy-button.shoplineapp.com/sdk.js';
      script.defer = true;
      script.async = true;
      script.id = 'shopline-buy-sdk';

      script.onload = () => {
        // console.log('Shopline SDK loaded');
        renderButton();
      };

      script.onerror = () => {
        console.error('Failed to load Shopline SDK');
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    const renderButton = () => {
      // console.log('Rendering button');
      if (!window.ShoplineBuy) {
        console.error('ShoplineBuy not available');
        setIsLoading(false);
        return;
      }

      window.ShoplineBuy.getClient({
        accessToken: "MTczNTgwNDAxNjIyNC02MjU5MjkyNjdmMzYyZDAwNGVjZTE4YjI=",
        endpoint: "https://buy-button.shoplineapp.com"
      })
        .then(client => {
          // console.log({ productID, variationId });
          client.render(".shopline-button-container", { // Changed from id to class selector
            "productBrief": {
              "layout": "dense",
              "callToAction": "checkout",
              "text": {
                "button": ""
              },
              "style": {
                "button": {
                  "textAlign": "center",
                  "radius": 0,
                  "width": 56,
                  "backgroundColor": "#2E7D32",
                  "color": "#fff",
                  "fontWeight": 700,
                  "borderColor": "transparent",
                  "fontSize": 16,
                  "fontFamily": "Noto Sans, sans-serif",
                }
              },
              "variantId": variationId
              // "variantId": '6752b627fe5288000e55e9db'
            },
            "type": "product",
            "id": productID,
            // "id": '6752b62835a724000ba07067',
          });

          setIsLoading(false);
        })
        .catch(error => {
          console.error('Error rendering button:', error);
          setIsLoading(false);
        });
    };

    loadSDK();
  }, []); // Empty dependency array ensures this runs once on mount

  return (
    <div>
      variation_key: {JSON.stringify(variationId)}< br />
      product_id: {JSON.stringify(productID)}< br />
      <div className="shopline-button-container"></div>
      {isLoading && <div className="text-gray-500">Loading...</div>}
    </div>
  );
};

export default ShoplineBuyButton;