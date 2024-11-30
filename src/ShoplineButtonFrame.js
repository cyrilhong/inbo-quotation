import { useState, useEffect } from 'react';

const ShoplineButton = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 直接加入購物車的函數
  const addToCart = async () => {
    setIsLoading(true);
    try {
      // 1. 直接發送加入購物車的請求
      const response = await fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{
            id: "6721dcce633618000a5591af",
            quantity: 1
          }]
        })
      });

      if (response.ok) {
        // 2. 手動開啟購物車頁面
        window.open('https://www.inbocoffee.com/cart', '_blank');
        setIsOpen(false);
      } else {
        throw new Error('加入購物車失敗');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('加入購物車失敗，請稍後再試');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(true)}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        打開購物視窗
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-4 relative min-w-[300px]">
            <button 
              onClick={() => setIsOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
              關閉
            </button>
            <div className="p-4 flex flex-col items-center">
              <h2 className="text-lg font-bold mb-4">加入購物車</h2>
              <button
                onClick={addToCart}
                disabled={isLoading}
                className="w-[180px] h-[40px] bg-[#b8becc] text-[#363d4d] border-none text-base font-sans hover:bg-[#a0a7b5] disabled:opacity-50"
              >
                {isLoading ? '處理中...' : 'Buy Now'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShoplineButton;