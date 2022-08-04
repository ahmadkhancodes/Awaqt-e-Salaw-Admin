import React, { useContext, useEffect } from "react";
import { Route, useNavigate } from "react-router";
import { LOGINCONTEXT, PROFILEAPPROVALCONTEXT } from "../context";

function ProtectedRoute({ element: Component, ...rest }) {
  const [login] = useContext(LOGINCONTEXT);
  const [profile] = useContext(PROFILEAPPROVALCONTEXT);
  const navigate = useNavigate();

  return (
    <Route
      {...rest}
      element={(props) => {
        if (login) {
          if (profile.activated) {
            return <Component {...props} />;
          } else {
            navigate("/approval");
          }
        } else {
          navigate("/");
        }
      }}
    />
  );
}

export default ProtectedRoute;
