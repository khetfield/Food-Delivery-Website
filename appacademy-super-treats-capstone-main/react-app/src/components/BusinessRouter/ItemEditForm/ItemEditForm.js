import "./ItemEditForm.css";

import { ConfirmDeleteModal } from "../../utils/ConfirmModal";
import { Link, useParams } from "react-router-dom";
import {
  selectSingleItem,
  thunkCreateItem,
  thunkDeleteItem,
  thunkGetOneItem,
  thunkUpdateItem,
} from "../../../store/items";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";

import { selectCategories } from "../../../store/userBusinesses";
import { useModal } from "../../../context/Modal";
import { Alert } from "@mui/material";

const defaultImage = `${process.env.REACT_APP_BACKEND_URL}/images/default-image.jpg`;

export default function ItemEditForm({ editItemId, handleClose }) {
  const dispatch = useDispatch();
  const imageRef = useRef();
  const { businessId } = useParams();
  const { setModalContent } = useModal();

  const item = useSelector(selectSingleItem);
  const categoriesObj = useSelector(selectCategories);
  const categories = Object.values(categoriesObj).sort(
    (a, b) => a.order - b.order
  );

  const [isEditting, setIsEditting] = useState(editItemId !== null);
  const [itemId, setItemId] = useState(editItemId);
  const [id, setId] = useState(0);
  const [name, setName] = useState("");
  const [about, setAbout] = useState("");
  const [image, setImage] = useState("");
  const [price, setPrice] = useState(0);
  const [categoryId, setCategoryId] = useState(0);
  const [errors, setErrors] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    if (!isEditting) return;
    if (item && item.id === Number(itemId)) return;
    dispatch(thunkGetOneItem(itemId));
  }, [dispatch]);

  useEffect(() => {
    setId((itemId && item?.id) || "");
    setName((itemId && item?.name) || "");
    setAbout((itemId && item?.about) || "");
    setImage((itemId && item?.image) || "");
    setPrice((itemId && item?.price) || 0);
    setCategoryId((itemId && item?.categoryId) || 0);
  }, [item, itemId]);

  const handleChangeImage = (e) => {
    const image = e.target.files[0];
    setImage(image);
    if (FileReader) {
      let fr = new FileReader();
      fr.onload = () => {
        imageRef.current.src = fr.result;
      };
      fr.readAsDataURL(image);
    }
  };

  const handleSubmit = async (e) => {
    e?.preventDefault();
    setIsSaving(true);

    const formData = new FormData();

    const itemObj = {
      id: item?.id,
      name,
      about,
      image,
      price,
      business_id: Number(businessId),
      category_id: Number(categoryId),
    };

    for (let [k, v] of Object.entries(itemObj)) formData.append(k, v);

    const res = await dispatch(
      isEditting ? thunkUpdateItem(formData) : thunkCreateItem(formData)
    );

    setErrors(res.errors || {});

    if (!res.errors && !isEditting) {
      setItemId(res.item.id);
      setIsEditting(true);
    }

    setIsSaving(false);
  };

  const onDelete = async () => {
    const res = await dispatch(thunkDeleteItem(item));
    // if (!res.errors) {}
    handleClose();
  };

  const handleDelete = (e) => {
    e.preventDefault();

    if (!isEditting) {
      handleClose();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <>
      {confirmDelete ? (
        <ConfirmDeleteModal
          deleteName={`${item.name}`}
          onDelete={onDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      ) : (
        <form
          className="create-item-form flex-c"
          onSubmit={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === "Enter") e.preventDefault();
          }}
        >
          {Number(price) === 0 && (
            <Alert severity="warning">
              Price is set to $0.00, this item will be free.
            </Alert>
          )}
          <header className="business-header">
            <Link to={`/business/${businessId}/menu/items`}>
              <i className="fa-solid fa-arrow-left ft-15"></i>
            </Link>
            <div className="item-actions flex">
              <button
                className="bt-pd"
                onClick={handleDelete}
              >
                Delete
              </button>
              <button
                className="item-actions__save bt-black bt-pd"
                disabled={isSaving}
              >
                {isSaving ? <i className="fa-regular fa-circle"></i> : "Save"}
              </button>
            </div>
          </header>
          <div className="create-item__name">
            <input
              placeholder="Name..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <p className="auth-error">{errors.name}</p>
          </div>

          <div className="create-item__category flex flex-01 g10">
            <span>Category</span>
            <select
              id="create-item__category"
              className="bt-black"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option
                value={0}
                hidden
              >
                None
              </option>
              {categories.map((c) => (
                <option
                  value={c.id}
                  key={c.id}
                >
                  {c.name}
                </option>
              ))}
            </select>
            {categoryId !== 0 && (
              <button
                id="delete-category"
                className="flex flex-11"
                onClick={() => setCategoryId(0)}
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            )}
          </div>
          {categoryId === 0 && (
            <p className="auth-error">
              This item will not be displayed unless it has a category
            </p>
          )}

          <div className="create-item__picture">
            <img
              src={image}
              alt=""
              ref={imageRef}
              onError={(e) => {
                e.target.src = defaultImage;
                e.target.style = "object-fit: contain";
              }}
              onLoad={(e) => {
                if (e.target.src !== defaultImage)
                  e.target.style = "object-fit: cover";
              }}
            />
            <label htmlFor="image">
              Item Picture (<em>optional</em> )
            </label>
            <input
              id="image"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleChangeImage}
            />
            <p className="auth-error">{errors.image}</p>
          </div>

          <div className="create-item__about">
            <label htmlFor="about">
              Description (<em>optional</em> )
            </label>
            <textarea
              id="about"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            <p className="auth-error">{errors.about}</p>
          </div>

          <div className="create-item__price flex-c">
            <label htmlFor="price">Item Price</label>
            <input
              id="price"
              type="number"
              value={price}
              onChange={(e) => setPrice(Number(e.target.value))}
              min={0}
              max={1000}
              step={0.01}
            />
            <p className="auth-error">{errors.price}</p>
          </div>
        </form>
      )}
    </>
  );
}
