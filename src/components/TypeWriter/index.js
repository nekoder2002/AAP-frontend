import React, { useState, useEffect } from 'react';

function TypeWriter({ children,typingSpeed,onFinish }) {
  const [displayText, setDisplayText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      if (currentIndex < children.length) {
        setDisplayText((prevText) => prevText + children[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      } else {
        onFinish();
        clearInterval(interval);
      }
    }, typingSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [children, typingSpeed, currentIndex]);

  return <div>{displayText}</div>;
}

export default TypeWriter;