import React from "react";
import { Badge as ChakraUIBadge } from "@chakra-ui/react";

export function Badge(props) {
  return <ChakraUIBadge color="blue.700" bg="blue.50" {...props} />;
}
