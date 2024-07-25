import "./CartItemCard.css";

import {
  selectCartItemForBusinessById,
  thunkDeleteCartItem,
  thunkEditCartItem,
} from "../../../store/carts";
import { useDispatch, useSelector } from "react-redux";

import { selectItemById } from "../../../store/items";
import { useEffect } from "react";

export default function CartItemCard({ businessId, cartItemId }) {
  const dispatch = useDispatch();

  const cartItem = useSelector(
    selectCartItemForBusinessById(businessId, cartItemId)
  );
  const item = useSelector(selectItemById(cartItem?.itemId));

  const handleDelete = () => {
    const cartItemObj = {
      ...cartItem,
      businessId,
    };
    dispatch(thunkDeleteCartItem(cartItemObj));
  };

  useEffect(() => {
    return () => {
      if (!cartItem.itemId) handleDelete();
    };
  }, []);

  const handleChangeQuantity = (e) => {
    if (e.target.value === cartItem.quantity) return;
    if (e.target.value === "0") return handleDelete();

    const cartItemObj = {
      id: cartItem.id,
      cartId: cartItem.cartId,
      quantity: e.target.value,
    };

    dispatch(thunkEditCartItem(cartItemObj));
  };

  return (
    <div className="cart-item-card flex-c">
      {item ? (
        <>
          <div className="flex flex-b1 g10">
            <p className="cart-item-card__name">{item.name}</p>
            <img
              src={item.image}
              alt=""
            />
          </div>
          <div className="flex flex-b1">
            <select
              value={cartItem.quantity}
              onChange={handleChangeQuantity}
              className="quantity-select"
            >
              <option value={0}>Remove</option>
              {Array.from({ length: 98 }, (_, i) => (
                <option
                  value={i + 1}
                  key={i + 1}
                >
                  {i + 1}
                </option>
              ))}
            </select>
            <span className="cart-item-card__price">${cartItem.price}</span>
          </div>
        </>
      ) : (
        <>
          <p className="auth-error">An item is no longer available</p>
          <p className="auth-error">
            This notification will be removed on closing
          </p>
        </>
      )}
    </div>
  );
}
