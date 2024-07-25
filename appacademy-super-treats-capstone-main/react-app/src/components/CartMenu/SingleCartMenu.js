import CartSidebar from "./CartSidebar/CartSidebar";
import { selectCartForBusiness } from "../../store/carts";
import { selectSingleBusiness } from "../../store/businesses";
import { useModal } from "../../context/Modal";
import { useSelector } from "react-redux";

export default function SingleCartMenu() {
  const business = useSelector(selectSingleBusiness);
  const cart = useSelector(selectCartForBusiness(business?.id));

  const { setModalContent, setModalClass } = useModal();

  const handleClick = () => {
    setModalClass("flex flex-20 fh");
    setModalContent(<CartSidebar businessId={business.id} />);
  };

  if (!cart) return null;

  return (
    <div
      className="cart-bt single-cart flex flex-11 bt-black"
      onClick={handleClick}
    >
      {business.image && (
        <img
          src={business.image}
          alt=""
        />
      )}
      <span>{cart.count} items</span>
    </div>
  );
}
