import React from "react";
import "../index.css";
import styled from "styled-components";

function NotFound(props) {
  return (
    <Container>
      <h1>404</h1>
      <p>Page Not Found</p>
    </Container>
  );
}

export default NotFound;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  h1 {
    font-size: 4rem;
  }
  p {
    font-size: 3rem;
    font-weight: bold;
  }
`;
