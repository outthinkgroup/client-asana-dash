import React from "react";
import "./index.css";

import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import AuthContextProvider from "./auth/Context.jsx";

//Pages
import Project from "./pages/Project/index.jsx";
import Home from "./pages/Home.jsx";
import NotFound from "./pages/NotFound.jsx";

export default function App() {
  return (
    <Router>
      <AuthContextProvider>
        <Switch>
          <Route exact path="/">
            <Home />
          </Route>
          <Route path="/project/:id" >
            <Project/>
          </Route>
          <Route path="*">
            <NotFound />
          </Route>
        </Switch>
      </AuthContextProvider>
    </Router>
  );
}
