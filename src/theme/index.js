import { extendTheme } from "@chakra-ui/react";
const colors = {
  blue: {
    50: "#EAEEFA",
    100: "#C4D1F2",
    200: "#9FB3EA",
    300: "#7995E2",
    400: "#5377DA",
    500: "#2E5AD1",
    600: "#2448A8",
    700: "#1B367E",
    800: "#122454",
    900: "#09122A",
  },
  orange: {
    50: "#FFECE5",
    100: "#FFCAB8",
    200: "#FFA78A",
    300: "#FF855C",
    400: "#FF632E",
    500: "#FF4100",
    600: "#CC3400",
    700: "#992700",
    800: "#661A00",
    900: "#330D00",
  },
};
const components = {
  Badge: {
    baseStyle: {
      borderRadius: "md",
    },
    defaultProps: {
      colorScheme: "blue",
    },
  },
};
const theme = extendTheme({ colors, components });
export default theme;
