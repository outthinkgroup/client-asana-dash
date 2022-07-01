import React from "react";
import { Redirect, useLocation } from "react-router-dom";
import styled from "styled-components";
import { AuthContext } from "../auth/Context.jsx";
import Login from "../components/Login.jsx";
import ProjectList from "../components/ProjectList.jsx";

function Home({ className }) {
  const params = useQuery();
  const auth = React.useContext(AuthContext);

  if (params.has("project")) {
    return (
      <Redirect
        to={{
          pathname: "/project",
          search: `?id=${params.get("project")}`,
        }}
      />
    );
  }
  return (
    <main className={className}>
      <header>
        <div className="wrapper">
          <h1>Plandout</h1>

          <h2>All Projects</h2>
          {!auth.isUserSignedIn && <Login />}
        </div>
      </header>
      <div className="projects wrapper">
        {auth.isUserSignedIn && <ProjectList />}
      </div>
    </main>
  );
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default styled(Home)`
  header {
    background: #eff6ff;

    h1 {
      margin: 0;
      color: #1e3a8a;
      font-size: 20px;
      font-weight: bold;
      margin-bottom: 0.4em;
    }
    h2 {
      margin-top: 0;
      font-size: 30px;
      font-weight: 300;
    }
    margin-bottom: 40px;
  }
  .wrapper {
    padding: 20px;
    max-width: 1000px;
    margin: 0 auto;
  }
`;
