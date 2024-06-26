import { defineStyleConfig, extendTheme } from "@chakra-ui/react";
import { inputTheme } from "./themeComponents/input";
import { selectTheme } from "./themeComponents/select";
import { textareaTheme } from "./themeComponents/textarea";

const Button = defineStyleConfig({
  baseStyle: {
    fontWeight: "600",
    fontSize: "16px",
    lineHeight: "1.11",
    borderRadius: "2000px",
  },
  sizes: {
    sm: {
      fontSize: "sm",
      px: 4,
      py: 3,
    },
    md: {
      fontSize: "md",
      px: 6,
      py: 4,
    },
  },
  variants: {
    ghost: {
      backgroundColor: "gray.50",
      border: "2px solid",
      borderColor: "gray.700",
      color: "gray.700",
    },
    outline: {
      border: "2px solid",
      borderColor: "teal.700",
      color: "gray.700",
    },
    solid: {
      bg: "teal.700",
      color: "white",
    },
  },
  // The default size and variant values
  defaultProps: {
    size: "md",
    variant: "outline",
  },
});

const Radio = defineStyleConfig({
  variants: {
    scale: {
      container: {
        alignItems: "center",
        display: "flex",
        flexDirection: "column",
      },
      label: {
        marginInlineStart: 0,
        // marginLeft: 2,
      },
    },
  },
});

const Tag = defineStyleConfig({
  baseStyle: {
    borderRadius: "8px",
    fontFamily: "Outfit",
    fontStyle: "normal",
    fontWeight: 600,
    fontSize: 14,
    lineHeight: 16,
  },
  variants: {
    solid: {
      border: "2px solid white",
    },
  },
});

export const theme = extendTheme({
  sizes: {
    container: {
      xl: "1440px",
    },
  },
  colors: {
    green: {
      "50": "#F6F8ED",
      "100": "#E6EBCC",
      "200": "#D5DDAB",
      "300": "#C5D08A",
      "400": "#B5C36A",
      "500": "#A5B649",
      "600": "#83913A",
      "700": "#636D2C",
      "800": "#42491D",
      "900": "#21240F",
    },
    red: {
      "50": "#FCEDE9",
      "100": "#F6CDC0",
      "200": "#F1AD98",
      "300": "#EB8D6F",
      "400": "#E66C47",
      "500": "#E04C1F",
      "600": "#B43D18",
      "700": "#872E12",
      "800": "#5A1F0C",
      "900": "#2D0F06",
    },
    blue: {
      "50": "#EDEFF7",
      "100": "#CDD2E9",
      "200": "#ADB5DB",
      "300": "#8D98CE",
      "400": "#60A29B",
      "500": "#4959A8",
      "600": "#3E4B8E",
      "700": "#2E396B",
      "800": "#1F2647",
      "900": "#0F1324",
    },
    yellow: {
      "50": "#FCF7E8",
      "100": "#F8E9BF",
      "200": "#F3DA96",
      "300": "#EECC6C",
      "400": "#EABD43",
      "500": "#E5AF1A",
      "600": "#B78C15",
      "700": "#896910",
      "800": "#5C460A",
      "900": "#2E2305",
    },
    teal: {
      "50": "#EFF6F5",
      "100": "#D2E5E3",
      "200": "#B4D4D1",
      "300": "#85C4BC",
      "400": "#7AB3AC",
      "500": "#5DA29A",
      "600": "#4A827B",
      "700": "#38615C",
      "800": "#25413E",
      "900": "#13201F",
    },
    gray: {
      "50": "#F6F5F4",
      "100": "#D1CCC7",
      "200": "#CAC4BF",
      "300": "#B5ADA6",
      "400": "#A0958D",
      "500": "#8B7E74",
      "600": "#6F655D",
      "700": "#534C46",
      "800": "#38322E",
      "900": "#1C1917",
    },
  },
  components: {
    Button,
    Input: inputTheme,
    NumberInput: inputTheme,
    Radio,
    Select: selectTheme,
    Tag,
    Textarea: textareaTheme,
  },
  fonts: {
    body: "'Outfit', sans-serif",
    heading: "'Zilla Slab', serif",
    mono: "Menlo, monospace",
  },
  styles: {
    global: {
      "html, body": {
        fontSize: 16,
      },
    },
  },
  textStyles: {
    bodyMain: {
      color: "gray.700",
      fontFamily: "'Outfit', sans-serif",
      fontWeight: "400",
      fontSize: ["18px"],
      lineHeight: "24px",
    },
    bodyLarge: {
      fontFamily: "'Outfit', sans-serif",
      fontWeight: "400",
      fontSize: ["24px"],
      lineHeight: "24px",
    },
    h1: {
      color: "gray.700",
      fontFamily: "'Zilla Slab', serif",
      fontSize: ["42px"],
      fontWeight: "700",
      letterSpacing: "0.02em",
      lineHeight: "1.14",
      textTransform: "uppercase",
    },
    h2: {
      fontFamily: "'Zilla Slab', serif",
      fontSize: ["24px"],
      fontWeight: "700",
      letterSpacing: "0.72px",
      lineHeight: "24px",
      textTransform: "uppercase",
    },
    h3: {
      fontFamily: "'Zilla Slab', serif",
      fontSize: ["18px"],
      fontWeight: "700",
      lineHeight: "24px",
    },
    h4: {
      color: "gray.700",
      fontFamily: "'Outfit', sans-serif",
      fontSize: ["10px"],
      fontWeight: "900",
      lineHeight: "24px",
      textTransform: "uppercase",
    },
  },
});
