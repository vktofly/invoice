// src/components/IconWrapper.tsx
import React from 'react';

interface IconWrapperProps {
  children: React.ReactNode;
}

const IconWrapper: React.FC<IconWrapperProps> = ({ children }) => {
  return <>{children}</>;
};

export default IconWrapper;
