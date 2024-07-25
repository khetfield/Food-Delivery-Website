import { Route, Switch } from "react-router-dom";

import ProtectedRoute from "../auth/ProtectedRoute";
import CreateBusinessPage from "./CreateBusinessPage";
import UserBussinessesHome from "./UserBusinessesHome";
import UserBusinessManagementPage from "./UserBusinessManagementPage";
import "./BusinessRouter.css";

export default function BusinessRouter() {
  return (
    <ProtectedRoute>
      <Switch>
        <Route path="/business/create">
          <CreateBusinessPage />
        </Route>
        <Route path="/business/:businessId">
          <UserBusinessManagementPage />
        </Route>
        <Route path="/business/">
          <UserBussinessesHome />
        </Route>
      </Switch>
    </ProtectedRoute>
  );
}
