import React from "react";
import { Redirect, useLocation } from "react-router-dom";
export default function Home() {
  const params = useQuery();
  if (params.has("project")) {
    return <Redirect
      to={{
        pathname: "/project",
        search: `?id=${params.get("project")}`,
      }}
    />;
  }
  return <h1>React Component</h1>;
}

function useQuery() {
  return new URLSearchParams(useLocation().search);
}
