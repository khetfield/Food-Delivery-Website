import "./CartMenu.css";

import { selectAllCarts, thunkGetAllCarts } from "../../store/carts";
import { useDispatch, useSelector } from "react-redux";

import AllCartsMenu from "./AllCartsMenu";
import SingleCartMenu from "./SingleCartMenu";
import { selectUser } from "../../store/session";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

export default function CartMenu() {
  const { businessId } = useParams();
  const dispatch = useDispatch();

  const user = useSelector(selectUser);
  const cartsObj = useSelector(selectAllCarts);
  const carts = Object.values(cartsObj);
  const currentCart = cartsObj[businessId];

  useEffect(() => {
    if (!user) return;
    dispatch(thunkGetAllCarts());
  }, [dispatch]);

  if (!user) return null;

  return (
    <div className="carts-menu__wrapper pg-pd">
      <div className="carts-menu flex">
        {currentCart && <SingleCartMenu />}
        {carts.length > 0 && <AllCartsMenu min={currentCart} />}
      </div>
    </div>
  );
}
