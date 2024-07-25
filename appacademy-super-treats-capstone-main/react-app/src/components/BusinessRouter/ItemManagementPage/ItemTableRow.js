import { useParams } from "react-router-dom";

import { selectCategoryById } from "../../../store/userBusinesses";
import { selectItemById } from "../../../store/items";
import { useSelector } from "react-redux";

const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US");
};

export default function ItemTableRow({ itemId, handleOpen }) {
  const { businessId } = useParams();
  const item = useSelector(selectItemById(itemId));
  const category = useSelector(selectCategoryById(item.categoryId));

  if (!item) return null;

  return (
    <tr
      key={item.id}
      onClick={handleOpen}
    >
      <td className="flex flex-11">
        {item.image && (
          <img
            className="item-table__image"
            src={item.image}
            alt=""
          />
        )}
      </td>
      <td className="flex flex-01">
        {category ? (
          <p className="item-table__category">{category.name}</p>
        ) : (
          <p className="auth-error">Not Offered</p>
        )}
      </td>
      <td className="flex flex-01">
        <p
          className="item-table__name"
          to={`/business/${businessId}/menu/items/${item.id}`}
        >
          {item.name}
        </p>
      </td>
      <td className="flex flex-11">
        <p className="item-table__price">
          <span>$</span>
          <span>{item.price}</span>
        </p>
      </td>
      <td className="flex flex-11">{formatDate(item.updatedAt)}</td>
    </tr>
  );
}
