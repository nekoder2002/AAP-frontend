import { useEffect, useState } from "react";

// 实时获取窗口尺寸
const useWindowSize = () => {
    const [width, setWidth] = useState(window.innerWidth);
    const [height, setHeight] = useState(window.innerHeight);

    const getWindowInfo = () => {
        setWidth(window.innerWidth);
        setHeight(window.innerHeight);
    };
    window.addEventListener('resize', getWindowInfo);

    return [width, height];
}

export { useWindowSize};