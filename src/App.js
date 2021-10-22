import React from "react";
import "./index.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import AuthContextProvider from "./auth/Context.js";

//Pages
import Project from "./pages/Project.js";
import Home from "./pages/Home.js";
import NotFound from "./pages/NotFound.js";

export default function App() {
  return (
    <Router>
      <AuthContextProvider>
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
      </AuthContextProvider>
    </Router>
  );
}
