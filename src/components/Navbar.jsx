import { getAuth } from "firebase/auth";
import { useContext, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import styled from "styled-components";
import { PROFILEAPPROVALCONTEXT } from "../context";
import { firebaseApp } from "../Firebase/config";

function Navbar({ isAdmin = false, profileData = false, getProfileData }) {
  const [profile, setProfile] = useContext(PROFILEAPPROVALCONTEXT);
  const [email, setEmail] = useState("");
  const navigate = useNavigate();
  return (
    <Nav className=" navbar navbar-expand-lg navbar-light bg-light">
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to="/"
          style={{
            fontSize: "1.5rem",
            fontWeight: "bold",
          }}
        >
          <img
            src="/adaptive-icon.png"
            alt=""
            width="40"
            className="d-inline-block align-text-center"
          />
          Auqat-e-Salah
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        <div
          className="collapse navbar-collapse justify-content-end"
          id="navbarNav"
        >
          <List className="navbar-nav ">
            {isAdmin && (
              <li className="nav-item">
                <NavLink className="nav-link" aria-current="page" to="/">
                  Dashboard
                </NavLink>
              </li>
            )}
            <li className="nav-item">
              <NavLink
                className={`nav-link ${
                  isAdmin && (isAdmin && profileData ? "" : "disabled")
                }`}
                aria-current="page"
                to={isAdmin ? "/profile" : "/"}
              >
                {isAdmin ? "Profile" : "SalahTime"}
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink
                className={`nav-link ${
                  isAdmin && (isAdmin && profileData ? "" : "disabled")
                }`}
                to="/edit"
              >
                Edit
              </NavLink>
            </li>
            {isAdmin && (
              <form
                className="d-flex"
                onSubmit={(e) => {
                  e.preventDefault();
                  getProfileData(email, navigate);
                }}
              >
                <input
                  className="form-control mb-2 me-2"
                  type="email"
                  placeholder="Enter email to view and edit a Mosque"
                  aria-label="Search"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.currentTarget.value);
                  }}
                />
                <button className="btn btn-outline-success me-5" type="submit">
                  Open
                </button>
              </form>
            )}
            <li className="nav-item">
              <div
                className="btn btn-light"
                onClick={() => {
                  setProfile({});
                  getAuth(firebaseApp).signOut();
                  navigate("/");
                }}
              >
                Logout
              </div>
            </li>
          </List>
        </div>
      </div>
    </Nav>
  );
}

export default Navbar;

const Nav = styled.nav`
  /* border-bottom: 1px solid rgba(0, 0, 0, 0.2); */
  margin: 0;
`;

const List = styled.ul`
  a {
    font-size: 1.5rem;
    color: black;
    font-weight: bold;
    margin-right: 3rem;
  }

  .btn {
    background-color: teal;
    color: white;
    font-weight: bold;
    font-size: 1.5rem;
  }

  .btn:hover {
    color: teal;
    background-color: white;
    border: 1px solid teal;
  }
  input {
    text-transform: none;
  }
`;
