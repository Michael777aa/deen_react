import React, { ReactNode } from 'react';
import { ScrollView as RNScrollView, ScrollViewProps } from 'react-native';

interface CustomScrollViewProps extends ScrollViewProps {
  children: ReactNode;
}

export const ScrollView: React.FC<CustomScrollViewProps> = ({ children, ...props }) => {
  return (
    <RNScrollView {...props}>
      {children}
    </RNScrollView>
  );
};