import "./LandingPage.css";

import { Link, useHistory } from "react-router-dom";
import { selectUser, setLocation } from "../../store/session";
import { useDispatch, useSelector } from "react-redux";

import PageHeader from "../PageHeader";
import { useState } from "react";

export default function LandingPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [address, setAddress] = useState(
    sessionStorage.getItem("current-address") || ""
  );
  const [delivery, setDelivery] = useState("delivery");

  const user = useSelector(selectUser);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(setLocation(address, delivery));
    sessionStorage.setItem("current-address", address);
    history.push("/feed");
  };

  if (sessionStorage.getItem("current-address")) history.push("/feed");

  return (
    <div className="landing-page fh flex-c">
      <div
        className="landing-page__background"
        style={{ width: window.screen.width, height: window.screen.height }}
      ></div>
      <PageHeader auth={!user} />
      <div className="landing__content pg-pd fh">
        <div className="landing__address-form-wrapper">
          <h1>Order food to your door</h1>
          <form
            className="landing__address-form flex"
            onSubmit={handleSubmit}
          >
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Enter your address"
              required
            />
            <select
              className="landing__delivery"
              value={delivery}
              onChange={(e) => setDelivery(e.target.value)}
            >
              <option value="delivery">Delivery</option>
              <option value="pickup">Pickup</option>
            </select>
            <button className="bt-black">Find Food</button>
          </form>
          <p className="signup-link">
            {!user && (
              <>
                <Link to="/signup">Sign In</Link> for your recent addresses
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
