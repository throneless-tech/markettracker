'use client';
import React from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import theme from './theme'

// fonts
import '@fontsource/inter/300.css';
import '@fontsource/outfit/100.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import '@fontsource/zilla-slab/400.css';
import '@fontsource/zilla-slab/700.css';

export default function ThemeProvider({ children }) {
  return (
    <ChakraProvider theme={theme}>
      {children}
    </ChakraProvider >
  );
}