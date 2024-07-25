import {
  Redirect,
  Route,
  Switch,
  useHistory,
  useParams,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import BusinessInfoPage from "./BusinessInfoPage";
import BusinessMenu from "./BusinessMenu";
import CategoryManagementPage from "./CategoryManagementPage";
import ItemManagementPage from "./ItemManagementPage";
import {
  selectSingleUserBusiness,
  thunkGetOneBusiness,
} from "../../store/userBusinesses";
import { useEffect } from "react";

export default function UserBusinessManagementPage() {
  const history = useHistory();
  const dispatch = useDispatch();
  const { businessId } = useParams();

  const business = useSelector(selectSingleUserBusiness);

  useEffect(() => {
    (async () => {
      const res = await dispatch(thunkGetOneBusiness(businessId));
      if (res.errors) history.push("/business");
    })();
  }, [dispatch]);

  if (business.id !== Number(businessId)) return null;

  return (
    <div className="business-page">
      <BusinessMenu />
      <Switch>
        <Route path="/business/:businessId/menu/items">
          <ItemManagementPage />
        </Route>
        <Route path="/business/:businessId/menu/categories">
          <CategoryManagementPage />
        </Route>
        <Route path="/business/:businessId/menu">
          <Redirect to={`/business/${businessId}/menu/items`} />
        </Route>
        <Route path="/business/:businessId">
          <BusinessInfoPage />
        </Route>
      </Switch>
    </div>
  );
}
