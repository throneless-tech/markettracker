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

function CustomDashboard() {
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

export default CustomDashboard;
