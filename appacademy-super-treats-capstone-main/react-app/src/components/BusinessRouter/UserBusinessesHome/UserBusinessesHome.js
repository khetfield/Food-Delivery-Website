import "./UserBusinessesHome.css";

import { Link, useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import BusinessCard from "../../BusinessBrowsingPage/BusinessCard";
import BusinessMenu from "../BusinessMenu";
import {
  selectAllUserBusinesses,
  thunkGetAllBusinesses,
} from "../../../store/userBusinesses";
import { useEffect } from "react";

export default function UserBusinessesHome() {
  const dispatch = useDispatch();
  const history = useHistory();
  const allBusinessesObj = useSelector(selectAllUserBusinesses);
  const allBusinesses = Object.values(allBusinessesObj);

  useEffect(() => {
    dispatch(thunkGetAllBusinesses());
  }, [dispatch]);

  return (
    <div className="business-page">
      <BusinessMenu />
      <div className="user-business__home pg-pd fh">
        <header className="business-header">
          <h2>Your Businesses</h2>
          <Link
            to="business/create"
            className="bt-black bt-pd"
          >
            <i className="fa-solid fa-plus"></i> Add Your Business
          </Link>
        </header>
        <div className="user-business__grid">
          {allBusinesses.map((b) => (
            <div
              key={b.id}
              onClick={() => history.push(`/business/${b.id}`)}
            >
              <BusinessCard
                business={b}
                isBrowsing={false}
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
