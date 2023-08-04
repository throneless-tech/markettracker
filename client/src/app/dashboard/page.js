"use client"

import {
  ChakraProvider,
  Box,
  Tabs,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import Dashboard from '../Components/Home.js';
import Nav from '../Components/Nav.js';
import SalesPanel from '../Components/SalesPanel/Main.js';
import theme from '../theme.js';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
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
              <SalesPanel />
            </TabPanel>
            <TabPanel>
              <p>my licenses</p>
            </TabPanel>
            <TabPanel>
              <p>my profile</p>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
