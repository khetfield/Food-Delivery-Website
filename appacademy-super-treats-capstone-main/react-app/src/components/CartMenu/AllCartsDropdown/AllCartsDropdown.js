import "./AllCartsDropdown.css";

import CartCard from "../CartCard";
import { selectAllCarts } from "../../../store/carts";
import { useSelector } from "react-redux";

export default function AllCartsDropdown({ top, right }) {
  const cartsObj = useSelector(selectAllCarts);
  const carts = Object.values(cartsObj);

  return (
    carts.length !== 0 && (
      <div
        className={"all-carts__dropdown"}
        style={{ top, right }}
      >
        {carts.map((cart) => (
          <CartCard
            cart={cart}
            key={cart.id}
          />
        ))}
      </div>
    )
  );
}
