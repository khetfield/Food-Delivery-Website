import "./ItemCard.css";

import AddToCart from "./AddToCart";
import { selectItemById } from "../../../store/items";
import { selectUser } from "../../../store/session";
import { useSelector } from "react-redux";

export default function ItemCard({ itemId }) {
  const item = useSelector(selectItemById(itemId));
  const user = useSelector(selectUser);

  if (!item) return null;

  return (
    <div
      className={
        "item-card " + (item.image ? "item-card--image" : "item-card--no-image")
      }
    >
      <img
        className="item-card__image"
        src={item.image}
        alt=""
      />
      <p className="item-card__name">{item.name}</p>
      {user && <AddToCart item={item} />}
      <p className="item-card__price">${item.price}</p>
      {!item.image && <p className="item-card__about">{item.about}</p>}
    </div>
  );
}
