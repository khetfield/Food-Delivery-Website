import {
  selectCategoryById,
  thunkDeleteCategory,
} from "../../../store/userBusinesses";
import { useDispatch, useSelector } from "react-redux";

import { ConfirmDeleteModal } from "../../utils/ConfirmModal/ConfirmDeleteModal";
import CreateCategoryModal from "./CreateCategoryModal";
import { useModal } from "../../../context/Modal";
import { useParams } from "react-router-dom";
import { useRef } from "react";

export default function CategoryTableRow({
  categoryId,
  setOrderChanged,
  setCategories,
}) {
  const { businessId } = useParams();
  const { setModalContent, setModalClass, closeModal } = useModal();
  const dispatch = useDispatch();
  const row = useRef();
  const category = useSelector(selectCategoryById(categoryId));

  const handleEdit = (e) => {
    e.preventDefault();
    setModalClass("flex flex-11");
    setModalContent(
      <CreateCategoryModal
        category={category}
        businessId={businessId}
      />
    );
  };

  const onDelete = () => {
    dispatch(thunkDeleteCategory(categoryId));
    setCategories((categories) => {
      const newCategories = [...categories];
      newCategories.splice(categories.indexOf(category), 1);
      return newCategories;
    });
    closeModal();
  };

  const handleDelete = (e) => {
    e.preventDefault();
    setModalClass("flex flex-11");
    setModalContent(
      <ConfirmDeleteModal
        deleteName={category.name}
        onDelete={onDelete}
      />
    );
  };

  const handleMove = (dir) => {
    setCategories((categories) => {
      const newCategories = [...categories];

      for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === categoryId) break;
      }

      if (i === 0 && dir === -1) return categories;
      else if (i === categories.length - 1 && dir === 1) return categories;

      const j = i + dir;

      [newCategories[i], newCategories[j]] = [
        newCategories[j],
        newCategories[i],
      ];

      setOrderChanged(true);
      return newCategories;
    });
  };

  if (!category) return null;

  return (
    <tr
      key={categoryId}
      data-id={categoryId}
      data-order={category.order}
      ref={row}
    >
      <td className="flex flex-11">{category.count}</td>
      <td className="flex flex-01">{category.name}</td>
      <td className="flex flex-11 g20">
        <i
          className="fa-solid fa-caret-up category-action category-action--move"
          onClick={() => handleMove(-1)}
        ></i>
        <i
          className="fa-solid fa-caret-down category-action category-action--move"
          onClick={() => handleMove(1)}
        ></i>
      </td>
      <td className="flex flex-11 g10">
        <i
          className="fa-solid fa-pen-to-square category-action"
          onClick={handleEdit}
        ></i>
        <i
          className="fa-solid fa-trash category-action"
          onClick={handleDelete}
        ></i>
      </td>
    </tr>
  );
}
