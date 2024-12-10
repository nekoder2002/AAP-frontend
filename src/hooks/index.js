import { useState } from "react";

// 实时获取窗口尺寸
const useWindowSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const debounce = (fn, delay) => {
        let timer;
        return function() {
            if (timer) {
                clearTimeout(timer);
            }
            timer = setTimeout(() => {
                fn();
            }, delay);
        }
    };

    const getWindowInfo = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };

    window.addEventListener('resize', debounce(getWindowInfo, 100));

    return [width, height];
}

export { useWindowSize};