import "./ItemBrowsingPage.css";

import {
  fetchAllBusinesses,
  selectBusinessById,
  selectSingleBusiness,
  thunkGetOneBusiness,
} from "../../store/businesses";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";

import CartMenu from "../CartMenu";
import CategorySidebar from "./CategorySidebar";
import ItemCard from "./ItemCard";
import PageHeader from "../PageHeader";
import { useEffect } from "react";

export default function ItemBrowsingPage() {
  const { businessId } = useParams();
  const dispatch = useDispatch();
  const history = useHistory();
  const business = useSelector(selectSingleBusiness);
  const haveAllBusinesses = useSelector(selectBusinessById(businessId));

  useEffect(() => {
    (async () => {
      const res = await dispatch(thunkGetOneBusiness(businessId));
      if (res.errors) history.push("/feed");
    })();
    if (!haveAllBusinesses) dispatch(fetchAllBusinesses());
  }, [dispatch, businessId]);

  useEffect(() => {
    const firstNonPicElement = document.querySelectorAll(
      ".item-card--image+.item-card--no-image"
    );

    for (let ele of firstNonPicElement) {
      const spacer = document.createElement("div");
      spacer.classList.add("flex-spacer");
      ele.parentNode.insertBefore(spacer, ele);
    }
  });

  if (business?.id !== Number(businessId)) return null;

  const categories = Object.values(business.categories).sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="business-browsing">
      <CartMenu />
      <header className="business-browsing__header flex-c">
        <PageHeader auth={true} />
        <img
          className="business-banner fw"
          src={business.image}
          alt=""
        />
        <div className="business-details pg-pd flex-c">
          <h2 className="business-details__name">{business.name}</h2>
          <p className="flex">
            <span>
              <i className="fa-solid fa-star"></i> {business.rating}
            </span>
            &bull;
            <span>{business.cuisine || business.type}</span>
            &bull;
            <span>{business.priceRange}</span>
          </p>
        </div>
      </header>
      <div className="business-browsing__body flex pg-pd">
        <CategorySidebar categories={categories} />
        <div className="fw">
          {categories.map((c) => (
            <section
              key={c.id}
              id={`category-${c.id}`}
              className="category-section"
            >
              <h2 className="category-section__heading">{c.name}</h2>
              <div className="item-grid">
                {c.itemIds.map((i) => (
                  <ItemCard
                    itemId={i}
                    key={i}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
