import { Redirect, Route } from "react-router-dom";

import React from "react";
import { selectUser } from "../../store/session";
import { useSelector } from "react-redux";

const ProtectedRoute = (props) => {
  const user = useSelector(selectUser);
  return (
    <Route {...props}>{user ? props.children : <Redirect to="/login" />}</Route>
  );
};

export default ProtectedRoute;
