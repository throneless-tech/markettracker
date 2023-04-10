import React from 'react';
import '@fontsource/outfit/100.css'
import '@fontsource/outfit/400.css'
import '@fontsource/outfit/500.css'
import '@fontsource/outfit/600.css'
import '@fontsource/outfit/700.css'
import '@fontsource/outfit/800.css'
import '@fontsource/zilla-slab/400.css'
import '@fontsource/zilla-slab/700.css'
import {
  ChakraProvider,
  Box,
  Tabs,
} from '@chakra-ui/react';
import theme from './theme';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Dashboard } from './components/dashboard';
import { Nav } from './components/nav';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        <Tabs variant='unstyled' colorScheme='teal'>
          <Nav />
          <Dashboard />
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
