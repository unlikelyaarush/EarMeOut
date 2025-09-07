import React, { useRef, useEffect, useState } from 'react';

const FadeContent = ({ 
  children, 
  className = '', 
  delay = 0, 
  duration = 0.6, 
  threshold = 0.1,
  rootMargin = '0px',
  ...props 
}) => {
  const elementRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            setIsVisible(true);
          }, delay);
        }
      },
      {
        threshold,
        rootMargin,
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => {
      if (elementRef.current) {
        observer.unobserve(elementRef.current);
      }
    };
  }, [threshold, rootMargin, delay]);

  return (
    <div
      ref={elementRef}
      className={`fade-content ${className} ${isVisible ? 'fade-in' : 'fade-out'}`}
      style={{
        transition: `opacity ${duration}s ease-out, transform ${duration}s ease-out`,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      }}
      {...props}
    >
      {children}
    </div>
  );
};

export default FadeContent;
