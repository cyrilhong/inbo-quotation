import { useEffect, useState } from 'react';

const ShoplineBuyButton = () => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log('Component mounted');

    document.addEventListener('click', function(event) {
      console.log(event.target);

      // Check if the clicked element is a link
      if (event.target.tagName === 'A') {
        console.log('A link was clicked:', event.target.href);

        if (event.target.href.includes('checkout')) {
          event.preventDefault(); // Prevent the default navigation
          console.log('Checkout link clicked, but navigation prevented.');

          // Open the checkout in a new window
          const newWindow = window.open(event.target.href, '_blank');

          // Close the new window after a timeout (e.g., 5 seconds)
          setTimeout(() => {
            if (newWindow) {
              newWindow.close();
              console.log('Checkout window closed.');
            }
          }, 5000); // Adjust the timeout as needed
        }
      }
    }, true); // Use capture phase to intercept events before they reach the target

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener('click', this);
    };
  }, []); // Empty dependency array ensures this runs once on mount

  useEffect(() => {
    console.log('Component mounted');

    // Load Shopline SDK
    const loadSDK = () => {
      const existingScript = document.getElementById('shopline-buy-sdk');
      if (existingScript) {
        console.log('Shopline SDK already loaded');
        renderButton();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://buy-button.shoplineapp.com/sdk.js';
      script.defer = true;
      script.async = true;
      script.id = 'shopline-buy-sdk';
      
      script.onload = () => {
        console.log('Shopline SDK loaded');
        renderButton();
      };

      script.onerror = () => {
        console.error('Failed to load Shopline SDK');
        setIsLoading(false);
      };

      document.body.appendChild(script);
    };

    const renderButton = () => {
      console.log('Rendering button');
      if (!window.ShoplineBuy) {
        console.error('ShoplineBuy not available');
        setIsLoading(false);
        return;
      }

      window.ShoplineBuy.getClient({
        accessToken: "MTczMzEyMDY3NDY3MS02MjU5MjkyNjdmMzYyZDAwNGVjZTE4YjI=",
        endpoint: "https://buy-button.shoplineapp.com"
      })
      .then(client => {
        console.log('Client obtained');
        client.render("#shopline-button-container", {
          "productBrief": {
            "layout": "dense",
            "callToAction": "checkout",
            "text": {
              "button": "Buy Now"
            },
            "style": {
              "button": {
                "textAlign": "center",
                "radius": 0,
                "width": 180,
                "backgroundColor": "#b8becc",
                "color": "#363d4d",
                "borderColor": "transparent",
                "fontSize": 16,
                "fontFamily": "Arial"
              }
            },
            "variantId": "6721dcce633618000a5591af"
          },
          "type": "product",
          "id": "6721dcce0ec455000b13b9a0"
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
    <div className="sl-buybutton-1733121385318">
      <div id="shopline-button-container"></div>
      {isLoading && <div className="text-gray-500">Loading...</div>}
    </div>
  );
};

export default ShoplineBuyButton;