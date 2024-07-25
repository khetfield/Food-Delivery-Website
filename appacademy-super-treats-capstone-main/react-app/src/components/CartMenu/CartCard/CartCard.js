import "./CartCard.css";

import CartSidebar from "../CartSidebar";
import { selectBusinessById } from "../../../store/businesses";
import { useModal } from "../../../context/Modal";
import { useSelector } from "react-redux";

export default function CartCard({ cart }) {
  const { setModalContent, setModalClass } = useModal();
  const business = useSelector(selectBusinessById(cart.businessId));

  const handleClick = () => {
    setModalClass("flex flex-20 fh");
    setModalContent(<CartSidebar businessId={business.id} />);
  };

  return (
    <div
      className="cart-card"
      onClick={handleClick}
    >
      <img
        className="cart-card__image"
        src={business.image}
        alt=""
      />
      <div className="cart-card__info flex-c">
        <h3 className="cart-card__name">{business.name}</h3>
        <p>Subtotal: ${cart.price}</p>
        <p>Deliver to {cart.address.split(/[,\n]/)[0]}</p>
      </div>
      <div className="cart-card__icons flex flex-11">
        <span className="cart-size bt-black flex flex-11">{cart.count}</span>
        <span>
          <i className="fa-solid fa-chevron-right"></i>
        </span>
      </div>
    </div>
  );
}
