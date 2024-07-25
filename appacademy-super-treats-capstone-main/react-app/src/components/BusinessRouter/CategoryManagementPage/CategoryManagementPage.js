import "./CategoryManagementPage.css";
import "../TableStyling.css";

import {
  selectCategories,
  thunkReorderCategories,
} from "../../../store/userBusinesses";
import { useDispatch, useSelector } from "react-redux";
import { useRef, useState } from "react";

import CategoryTableRow from "./CategoryTableRow";
import CreateCategoryModal from "./CreateCategoryModal";
import { useModal } from "../../../context/Modal";
import { useParams } from "react-router-dom";

export default function CategoryManagementPage() {
  const { businessId } = useParams();
  const { setModalContent, setModalClass } = useModal();
  const dispatch = useDispatch();
  const categoryTable = useRef();

  const categoriesObj = useSelector(selectCategories);
  const originalCategories = Object.values(categoriesObj).sort(
    (a, b) => a.order - b.order
  );

  const [orderChanged, setOrderChanged] = useState(false);
  const [categories, setCategories] = useState([...originalCategories]);

  const handleAddCategory = () => {
    setModalContent(
      <CreateCategoryModal
        businessId={businessId}
        setCategories={setCategories}
      />
    );
    setModalClass("flex flex-11");
  };

  const handleUpdateOrder = async () => {
    const order = { business_id: Number(businessId), categories: {} };
    categories.forEach((c, i) => (order.categories[c.id] = i));

    const res = await dispatch(thunkReorderCategories(order));
    if (!res.errors) setOrderChanged(false);
  };

  const handleResetOrder = () => {
    setCategories([...originalCategories]);
    setOrderChanged(false);
  };

  return (
    <div className="category-management-page">
      <header>
        <div
          id="category-management-header"
          className="flex flex-b1"
        >
          <h2>Menu Categories</h2>
          <div className="flex g10">
            {orderChanged && (
              <>
                <button
                  className="bt-black bt-pd"
                  onClick={handleResetOrder}
                >
                  Reset Order
                </button>
                <button
                  className="bt-black bt-pd"
                  onClick={handleUpdateOrder}
                >
                  Save Order
                </button>
              </>
            )}
            <button
              className="bt-black bt-pd"
              onClick={handleAddCategory}
            >
              <i className="fa-solid fa-plus"></i> Add Category
            </button>
          </div>
        </div>
      </header>
      <div>
        <table className="business-table category-table">
          <thead>
            <tr>
              <th className="flex flex-11">Items</th>
              <th className="flex flex-01">Category</th>
              <th className="flex flex-11"></th>
            </tr>
          </thead>
          <tbody ref={categoryTable}>
            {categories.map((c) => (
              <CategoryTableRow
                key={c.id}
                categoryId={c.id}
                setOrderChanged={setOrderChanged}
                setCategories={setCategories}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
