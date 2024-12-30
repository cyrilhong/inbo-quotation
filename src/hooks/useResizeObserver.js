import { useEffect } from 'react';

const useResizeObserver = () => {
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func(...args), delay);
        };
    };
    useEffect(() => {
        const sendHeight = debounce(() => {
            const iframeHeight = document.body.scrollHeight;
            window.parent.postMessage({ iframeHeight }, '*');
        }, 300);
    
        const resizeObserver = new ResizeObserver(() => {
            sendHeight();
        });
    
        resizeObserver.observe(document.body);
    
        return () => {
            resizeObserver.disconnect();
            clearTimeout(sendHeight); // 確保清理定時器
        };
    }, []); // 空依賴數組表示只在組件掛載和卸載時執行一次
};

export default useResizeObserver;