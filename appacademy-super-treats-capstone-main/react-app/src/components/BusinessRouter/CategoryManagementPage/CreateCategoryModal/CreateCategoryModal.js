import { useState } from "react";
import { useDispatch } from "react-redux";
import { useModal } from "../../../../context/Modal";

import {
  thunkCreateCategory,
  thunkEditCategory,
} from "../../../../store/userBusinesses";
import "./CreateCategoryModal.css";

export default function CreateCategoryModal({
  category,
  businessId,
  setCategories,
}) {
  const { closeModal } = useModal();
  const dispatch = useDispatch();
  const [name, setName] = useState(category?.name || "");
  const [errors, setErrors] = useState({});
  
  const handleChangeName = (e) => {
    const name = e.target.value;
    const errors = {};
    if (name.length <= 25) setName(e.target.value);
    if (name.length >= 25) errors.name = "Reached max length of 25";
    setErrors(errors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const categoryObj = {
      id: category?.id,
      name,
      business_id: businessId,
    };
    const res = await dispatch(
      category
        ? thunkEditCategory(categoryObj)
        : thunkCreateCategory(categoryObj)
    );
    if (res.errors) setErrors(res.errors);
    else {
      if (!category)
        setCategories((categories) => [...categories, res.category]);
      closeModal();
    }
  };

  return (
    <form
      className="category-form flex flex-c g10"
      onSubmit={handleSubmit}
    >
      {category ? <h2>Edit Category</h2> : <h2>Create New Category</h2>}
      <input
        value={name}
        onChange={handleChangeName}
        max={25}
        autoFocus
      />
      <p className="auth-error">{errors.name}</p>
    </form>
  );
}
