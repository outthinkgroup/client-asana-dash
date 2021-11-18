import { mode, transparentize, getColor } from "@chakra-ui/theme-tools";
import { extendTheme } from "@chakra-ui/react";
const colors = {
  blue: {
    50: "#E5F1FF",
    100: "#B8D7FF",
    200: "#8ABDFF",
    300: "#5CA3FF",
    400: "#2E89FF",
    500: "#0070FF",
    600: "#0059CC",
    700: "#004399",
    800: "#002D66",
    900: "#001633",
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
    //Found this here
    //https://github.com/chakra-ui/chakra-ui/blob/main/packages/theme/src/components/badge.ts#L24
    variants: {
      subtle: (props) => {
        const { colorScheme: c, theme } = props;
        const darkBg = transparentize(`${c}.200`, 0.16)(theme);
        return {
          bg: mode(`${c}.50`, darkBg)(props),
          color: mode(`${c}.700`, `${c}.200`)(props),
        };
      },
      outline: (props) => {
        const { colorScheme: c, theme } = props;
        const darkColor = transparentize(`${c}.200`, 0.8)(theme);
        const lightColor = getColor(theme, `${c}.700`);
        const color = mode(lightColor, darkColor)(props);
        return {
          boxShadow: `inset 0 0 0px 1px ${color}`,
          color,
        };
      },
    },
  },
};

const theme = extendTheme({ colors, components });
export default theme;
