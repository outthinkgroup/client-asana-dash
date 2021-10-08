import React from "react";
import styled from "styled-components";

export default function ShowError({ message }) {
  return (
    <ErrorCard>
      <h2>An Error Occured</h2>
      <p>{message}</p>
    </ErrorCard>
  );
}
const ErrorCard = styled.div`
  padding: 20px;
  border-radius: 10px;
  background: white;
  box-shadow: 0 50px 100px rgba(50, 50, 93, 0.1),
    0 15px 35px rgba(50, 50, 93, 0.15), 0 5px 15px rgba(0, 0, 0, 0.1);
  h2 {
    color: pink;
  }
  max-width: 480px;
`;
