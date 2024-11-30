import React, { useEffect, useState } from "react";
import './App.css';
import ShoplineButtonFrame from "./ShoplineButtonFrame";
function App() {
  const [email, setEmail] = useState("");
  useEffect(() => {
    // 提取查詢參數中的 email
    const queryParams = new URLSearchParams(window.location.search);
    const emailFromURL = queryParams.get("email");
    if (emailFromURL) {
      setEmail(emailFromURL);
      // 將 email 存入 localStorage 或其他儲存機制
      localStorage.setItem("email", emailFromURL);
    }
  }, []);

  const cartData = {
    items: [
      { productId: '123', quantity: 2 },
      { productId: '456', quantity: 1 }
    ]
  };

  const handleCheckout = () => {
    window.parent.postMessage(cartData, '*');
  }

  return (
    <div className="App">
      <header className="App-header">
        {/* <h1>Email Value:</h1>
        <p>{email || "No email found in URL"}</p>
        <button
          onClick={handleCheckout}
        >Click me</button> */}
        <ShoplineButtonFrame />
      </header>
    </div>
  );
}

export default App;
