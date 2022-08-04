import React from "react";
import "../index.css";
import styled from "styled-components";
// import { showHearder } from "../App";

function NotApproved(props) {
  // const [show, setShow] = useContext(showHearder);
  // useEffect(() => {
  //   if (show) {
  //     setShow(false);
  //   }
  // });
  return (
    <Container>
      <p>Your Are Being Reviewed.</p>
      <p>
        <a href={"mailto:haseebshah936@gmail.com"}>Contact us</a>
      </p>
    </Container>
  );
}

export default NotApproved;

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
  a {
    text-transform: none;
  }
`;
