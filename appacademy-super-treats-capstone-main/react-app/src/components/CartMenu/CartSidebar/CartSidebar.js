import "./CartSidebar.css";

import {
  selectAllCarts,
  selectCartForBusiness,
  thunkDeleteCart,
} from "../../../store/carts";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import AllCartsDropdown from "../AllCartsDropdown";
import CartItemCard from "../CartItemCard";
import SubmitOrderModal from "../SubmitOrderModal";
import { selectBusinessById } from "../../../store/businesses";
import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";

export default function CartSidebar({ businessId }) {
  const dispatch = useDispatch();
  const history = useHistory();
  const cartActionsRef = useRef();
  const [actionsHidden, setActionsHidden] = useState(true);
  const [menuHidden, setMenuHidden] = useState(true);

  const allCarts = useSelector(selectAllCarts);
  const cart = useSelector(selectCartForBusiness(businessId));
  const business = useSelector(selectBusinessById(businessId));

  const { closeModal, setModalContent, setModalClass } = useModal();
  const cartItems = Object.values(cart?.cartItems || {}).sort((a, b) => {
    if (!a.itemId) return -1;
    if (!b.itemId) return 1;
    else return a.id - b.id;
  });

  const openActions = (e) => {
    e.stopPropagation();
    if (actionsHidden) setActionsHidden(false);
    else closeActions(e);
  };

  const closeActions = (e) => {
    setActionsHidden(true);
  };

  const openMenu = (e) => {
    e.stopPropagation();
    if (menuHidden) setMenuHidden(false);
    else closeMenu(e);
  };

  const closeMenu = (e) => {
    setMenuHidden(true);
  };

  useEffect(() => {
    document.addEventListener("click", closeActions);
    document.addEventListener("click", closeMenu);
    document.body.classList.add("hide-scroll");
    return () => {
      document.removeEventListener("click", closeActions);
      document.removeEventListener("click", closeMenu);
      document.body.classList.remove("hide-scroll");
    };
  }, []);

  const handleAddItems = () => {
    history.push(`/feed/${business.id}`);
    closeModal();
  };

  const handleClearCart = async () => {
    await dispatch(thunkDeleteCart(cart));
    closeModal();
  };

  const handleSubmitOrder = async () => {
    await handleClearCart();
    setModalClass("flex flex-11");
    setModalContent(<SubmitOrderModal />);
  };

  if (!cart) {
    closeModal();
    return null;
  }

  return (
    <div className="cart-sidebar flex-c">
      <div className="cart-sidebar__actions flex flex-b1">
        <button
          className="close-sidebar"
          onClick={closeModal}
        >
          <i className="fa-solid fa-xmark"></i>
        </button>

        <div className="cart-sidebar__cart-dropdown-wrapper">
          <div
            className="cart-sidebar__cart-dropdown-button"
            onClick={openMenu}
          >
            Carts ({Object.values(allCarts).length}){" "}
            {menuHidden ? (
              <i className="fa-solid fa-chevron-down"></i>
            ) : (
              <i className="fa-solid fa-chevron-up"></i>
            )}
          </div>
          {!menuHidden && (
            <AllCartsDropdown
              top="100%"
              right="-40px"
            />
          )}
        </div>
      </div>

      <div className="flex flex-b1">
        <div className="flex-c">
          <h2 onClick={handleAddItems}>{business.name} </h2>
          <p>Deliver to {cart.address.split(/(\n|,)/)[0]}</p>
        </div>
        <button
          className="cart-sidebar__dropdown-button bt-pd flex flex-11"
          onClick={openActions}
        >
          <i className="fa-solid fa-ellipsis"></i>
        </button>
        <ul
          className={
            "cart-sidebar__dropdown flex-c" + (actionsHidden ? " hidden" : "")
          }
          ref={cartActionsRef}
        >
          <li>
            <div className="flex flex-11">
              <i className="fa-solid fa-plus"></i>
            </div>
            <div
              className="flex flex-01"
              onClick={handleAddItems}
            >
              <p>Add Items</p>
            </div>
          </li>
          <li className="delete-cart">
            <div className="flex flex-11">
              <i className="fa-solid fa-trash"></i>
            </div>
            <div
              className="flex flex-01"
              onClick={handleClearCart}
            >
              <p>Clear Cart</p>
            </div>
          </li>
        </ul>
      </div>
      <div className="cart-sidebar__summary flex flex-b1">
        <span>
          <strong>{cart.count} items</strong>
        </span>
        <span>
          Subtotal: <strong>${cart.price}</strong>
        </span>
      </div>
      <div className="cart-item-list flex-c">
        {cartItems.map((i) => (
          <CartItemCard
            businessId={businessId}
            cartItemId={i.id}
            key={i.id}
          />
        ))}
      </div>
      <div className="cart-sidebar__subtotal flex flex-b1 ft-15">
        <p>Subtotal</p>
        <p>${cart.price}</p>
      </div>
      <div className="cart-sidebar__submit">
        <button
          className="bt-black bt-pd fw"
          onClick={handleSubmitOrder}
        >
          Submit Order
        </button>
      </div>
    </div>
  );
}
