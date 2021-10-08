import React from "react";
import { BrowserRouter as Router, Link, Route, Switch } from "react-router-dom";

//Pages
import Project from "./pages/Project.js";
import Home from "./pages/Home.js";
import NotFound from "./pages/NotFound.js";

export default function App() {
  return (
    <Router>
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
    </Router>
  );
}
