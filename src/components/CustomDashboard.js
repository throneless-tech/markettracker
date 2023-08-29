"use client"

import React from 'react'

import {
  ChakraProvider,
  Box,
  Tabs,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import Dashboard from './Home.js';
import Nav from './Nav.js';
import SalesPanel from './SalesPanel.js';
import theme from '../styles/theme.js';

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

function CustomDashboard() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Tabs variant="unstyled" colorScheme="teal">
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

export default CustomDashboard;
