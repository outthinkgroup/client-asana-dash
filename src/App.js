import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";

import AuthContextProvider from "./auth/Context.js";

//Pages
import Project from "./pages/Project.js";
import Home from "./pages/Home.js";
import NotFound from "./pages/NotFound.js";

//Theme
import theme from "./theme";

export default function App() {
  return (
    <Router>
      <AuthContextProvider>
        <ChakraProvider theme={theme}>
          <Switch>
            <Route exact path="/">
              <Home />
            </Route>
            <Route path="/project/">
              <Project />
            </Route>
            <Route path="*">
              <NotFound />
            </Route>
          </Switch>
        </ChakraProvider>
      </AuthContextProvider>
    </Router>
  );
}
