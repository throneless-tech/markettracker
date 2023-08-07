"use client"

import {
  ChakraProvider,
  Box,
  Tabs,
  TabPanel,
  TabPanels,
} from '@chakra-ui/react';
import Dashboard from '../../Components/Home.js';
import Markets from '../../Components/Markets/Main.js';
import Nav from '../../Components/Nav.js';
import SalesPanel from '../../Components/SalesPanel/Main.js';
import theme from '../../theme.js';

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Tabs variant="unstyled" colorScheme="teal">
          <Nav />
          <Box>
            test
          </Box>
        </Tabs>
      </Box>
    </ChakraProvider>
  );
}

export default App;
