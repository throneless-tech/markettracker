import React from 'react';
import '@fontsource/outfit/100.css';
import '@fontsource/outfit/400.css';
import '@fontsource/outfit/500.css';
import '@fontsource/outfit/600.css';
import '@fontsource/outfit/700.css';
import '@fontsource/outfit/800.css';
import '@fontsource/zilla-slab/400.css';
import '@fontsource/zilla-slab/700.css';
import {
  ChakraProvider,
  Box,
  Tabs,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import theme from './theme';
import { ColorModeSwitcher } from './ColorModeSwitcher';
import { Dashboard } from './components/Dashboard/Main.js';
import { Footer } from './components/Footer';
import { Nav } from './components/Nav.js';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        {/* <ColorModeSwitcher justifySelf="flex-end" /> */}
        <Tabs variant="unstyled" colorScheme="teal">
          <Nav />
          <TabPanels>
            <TabPanel>
              <Dashboard />
            </TabPanel>
            <TabPanel>
              <p>my markets</p>
            </TabPanel>
            <TabPanel>
              <p>my sales</p>
            </TabPanel>
            <TabPanel>
              <p>my licenses</p>
            </TabPanel>
            <TabPanel>
              <p>my profile</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
