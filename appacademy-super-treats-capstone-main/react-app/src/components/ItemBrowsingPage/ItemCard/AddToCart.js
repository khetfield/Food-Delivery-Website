import {
  selectCartItemForBusinessById,
  thunkAddToCart,
  thunkDeleteCartItem,
} from "../../../store/carts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

export default function AddToCart({ item }) {
  const dispatch = useDispatch();
  const menuRef = useRef();
  const { businessId } = useParams();
  const [expand, setExpand] = useState(false);

  const cartItem = useSelector(
    selectCartItemForBusinessById(businessId, item.cartItemId)
  );

  useEffect(() => {
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  const addToCart = (e) => {
    const itemObj = {
      id: item.id,
      item_id: item.id,
      quantity: 1,
      address: sessionStorage.getItem("current-address"),
    };
    dispatch(thunkAddToCart(itemObj));
    setExpand(true);
  };

  const removeFromCart = (e) => {
    e.stopPropagation();
    const cartItemObj = {
      ...cartItem,
      businessId,
    };
    dispatch(thunkDeleteCartItem(cartItemObj));
    setExpand(false);
  };

  const closeMenu = (e) => {
    if (menuRef.current.contains(e.target)) return;
    setExpand(false);
  };

  const openMenu = (e) => {
    if (!expand) setExpand(true);
    else closeMenu(e);
  };

  return (
    <>
      <div
        className="add-to-cart flex flex-11"
        ref={menuRef}
        onClick={openMenu}
      >
        {expand && (
          <button
            className="bt-black flex flex-11"
            onClick={removeFromCart}
          >
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
        {cartItem && (
          <span className="add-to-cart__count">{cartItem.quantity}</span>
        )}
        {(!cartItem || expand) && (
          <button
            className="bt-black flex flex-11"
            onClick={addToCart}
          >
            <i className="fa-solid fa-plus"></i>
          </button>
        )}
      </div>
    </>
  );
}
