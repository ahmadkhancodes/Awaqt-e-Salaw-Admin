import React, { useContext, useEffect, useState } from "react";
import "../index.css";
import styled from "styled-components";
// import { loginState, showHearder } from "../App";
import { color } from "../Style/color";
import {
  getAuth,
  sendEmailVerification,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { firebaseApp } from "../Firebase/config";
import { Link, useNavigate } from "react-router-dom";
import { LOGINCONTEXT, LOADEDCONTEXT } from "../context";

function Login(props) {
  const [show, setShow] = useState();
  const [login, setLogin] = useContext(LOGINCONTEXT);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const [isLoaded, setLoaded] = useContext(LOADEDCONTEXT);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!(email === "" || password === "")) {
      const auth = getAuth(firebaseApp);
      signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;
          if (!user.emailVerified) {
            sendEmailVerification(auth.currentUser).then(() => {
              alert(
                "A verification link was sent to you Please verify your Email"
              );
            });
            setLogin(false);
          } else {
            setLogin(user);
            setLoaded(false);
          }
        })
        .catch((error) => {
          const errorCode = error.code;
          alert(errorCode.substring(5, errorCode.length).replaceAll("-", " "));
        });
    }
  };

  return (
    <Wrap>
      <i className="fas fa-times" id="form-close"></i>
      <form onSubmit={handleSubmit}>
        <h3>login</h3>
        <input
          type="email"
          name="email"
          className="box"
          placeholder="Enter your email"
          onChange={(text) => setEmail(text.target.value)}
        />
        <input
          type="password"
          name="password"
          className="box"
          placeholder="Enter your password"
          onChange={(e) => {
            setPassword(e.target.value);
          }}
        />
        <input type="submit" value="login now" className="btn" />
        <Container>
          <Link color="black" to="/signup">
            Register Now
          </Link>
          <Link color="black" to="/forgotPassword">
            Forgot Password
          </Link>
        </Container>
      </form>
    </Wrap>
  );
}

export default Login;

const Wrap = styled.div`
  min-height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  width: 100%;
  background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
    url("/back.jpg");

  background-position: center;
  background-size: cover;
  background-repeat: no-repeat;
  display: flex;
  align-items: center;
  justify-content: center;
  .btn {
    display: inline-block;
    margin-top: 1rem;
    background: ${color.primary};
    color: white;
    padding: 0.8rem 3rem;
    border: 0.2rem solid ${color.primary};
    cursor: pointer;
    font-size: 1.7rem;
  }

  .btn:hover {
    background: rgba(34, 253, 5, 0.157);
    color: ${color.primary};
  }

  .btn:visited {
    background: ${color.primary};
    color: white;
  }

  form {
    margin: 2rem;
    padding: 1.5rem 2rem;
    border-radius: 0.5rem;
    background: #fff;
    border: 1px solid rgba(0, 0, 0, 0.15);
    width: 50rem;
  }

  form h3 {
    font-size: 3rem;
    text-align: center;
    text-transform: uppercase;
    color: #444;
    padding: 1rem 0;
    font-weight: bold;
  }

  form .box {
    width: 100%;
    padding: 1rem;
    font-size: 1.7rem;
    color: #333;
    margin: 0.6rem 0;
    border: 0.1rem solid rgba(0, 0, 0, 0.3);
    text-transform: none;
  }

  form .box:focus {
    border-color: ${color.primary};
  }

  form #remember {
    margin: 2rem 0;
  }

  form label {
    font-size: 1.5rem;
  }

  form .btn {
    width: 100%;
  }

  form p {
    padding: 0.5rem 0;
    font-size: 1.5rem;
    color: #666;
  }

  form p a {
    color: ${color.primary};
  }

  form p a:hover {
    color: #333;
    text-decoration: underline;
  }

  #form-close {
    position: absolute;
    top: 2rem;
    right: 3rem;
    font-size: 5rem;
    color: white;
    cursor: pointer;
  }
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  margin: 1rem 0.5rem;
  align-items: center;
  a {
    color: black;
    font-size: 1.2rem;
    margin: 0.3rem 0;
    text-decoration: underline;
  }
  a:visited {
    color: black;
  }
`;
