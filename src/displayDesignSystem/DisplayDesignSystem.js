import React from "react";
import { ChakraProvider } from "@chakra-ui/react";

import theme from "../theme";
import * as System from "../elements";

export function DisplayDesignSystem() {
  return (
    <ChakraProvider them={theme}>
      <h1>Design System</h1>

      <main style={{ padding: `60px` }}>
        <article>
          <h2>Badge</h2>
          <System.Badge>Hello</System.Badge>
        </article>
      </main>
    </ChakraProvider>
  );
}
