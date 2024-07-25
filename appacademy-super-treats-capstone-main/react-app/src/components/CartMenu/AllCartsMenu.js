import { useEffect, useState } from "react";

import AllCartsDropdown from "./AllCartsDropdown/AllCartsDropdown";
import { selectAllCarts } from "../../store/carts";
import { useSelector } from "react-redux";

export default function AllCartsMenu({ min }) {
  const [hidden, setHidden] = useState(true);

  const cartsObj = useSelector(selectAllCarts);
  const carts = Object.values(cartsObj);

  const openMenu = (e) => {
    e.stopPropagation();
    if (hidden) setHidden(false);
    else closeMenu(e);
  };

  const closeMenu = (e) => {
    setHidden(true);
  };

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <>
      <div
        className="cart-bt all-carts flex flex-11 bt-pd bt-black"
        onClick={openMenu}
      >
        <i className="fa-solid fa-cart-shopping"></i>
        {!min && (
          <>
            <span>{carts?.length || 0} carts</span>
            <i className="fa-solid fa-angle-down"></i>
          </>
        )}
      </div>
      {!hidden && (
        <AllCartsDropdown
          top="100%"
          right="0%"
        />
      )}
    </>
  );
}
