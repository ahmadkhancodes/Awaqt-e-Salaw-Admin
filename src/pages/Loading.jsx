import React, { useContext, useEffect } from "react";
import styled from "styled-components";
import Lottie from "react-lottie";
import animation from "../loading.json";

function Loading(props) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData: animation,
    rendererSettings: {
      preserveAspectRatio: "xMidYMid slice",
    },
  };

  return (
    <Container>
      <Lottie options={defaultOptions} height={300} width={300} />
    </Container>
  );
}

export default Loading;

const Container = styled.div`
  height: 100vh;
  width: 100vw;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 23px;
`;
