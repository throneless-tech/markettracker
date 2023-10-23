"use client";

// base imports
import React from "react";
import Link from "next/link";
import theme from "./theme";
import { ChakraProvider, Box } from "@chakra-ui/react";

// fonts
import "@fontsource/inter/300.css";
import "@fontsource/outfit/100.css";
import "@fontsource/outfit/400.css";
import "@fontsource/outfit/500.css";
import "@fontsource/outfit/600.css";
import "@fontsource/outfit/700.css";
import "@fontsource/outfit/800.css";
import "@fontsource/zilla-slab/400.css";
import "@fontsource/zilla-slab/700.css";

// components
import Footer from "./Components/Footer";
import Login from "./Components/Login";

function App() {
  return (
    <ChakraProvider theme={theme}>
      <Box>
        <Login />
        <Footer />
      </Box>
    </ChakraProvider>
  );
}

export default App;
