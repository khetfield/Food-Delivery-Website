import "./FilterSidebar.css";

import { changeFilter, changeOrder } from "../../../store/businesses";
import { useDispatch } from "react-redux";
import { useState } from "react";

export const orderOptions = [
  {
    text: "Picked for you (default)",
    name: "default",
    property: (b) => b.id,
    desc: false,
  },
  {
    text: "A-Z",
    name: "a-z",
    property: (b) => b.name,
    desc: false,
  },
  {
    text: "Rating",
    name: "rating",
    property: (b) => Number(b.rating),
    desc: true,
  },
  {
    text: "Delivery fee",
    name: "delivery",
    property: (b) => Number(b.deliveryFee),
    desc: false,
  },
];

const priceRangeOptions = ["$", "$$", "$$$", "$$$$"];

export default function FilterSidebar() {
  const dispatch = useDispatch();
  const [orderIndex, setOrderIndex] = useState(0);
  const [priceRange, setPriceRange] = useState({});

  const handleChangeOrder = (orderIndex) => {
    setOrderIndex(orderIndex);
    dispatch(changeOrder(orderIndex));
  };

  const handleChangePriceRange = (price) => {
    const newPriceRange = { ...priceRange };
    if (newPriceRange[price]) {
      delete newPriceRange[price];
    } else {
      newPriceRange[price] = true;
    }
    setPriceRange(newPriceRange);
    dispatch(changeFilter(Object.keys(newPriceRange).join(".")));
  };

  return (
    <div className="filter-sidebar">
      <h2 className="flex flex-01 g10">Filters</h2>
      <section className="filter-sidebar__section">
        <h3>Sort</h3>
        <div className="flex-c">
          {orderOptions.map((o, i) => (
            <div
              className="flex"
              key={i}
            >
              <input
                id={o.name}
                className="order-radio"
                type="radio"
                name="order"
                value={o.name}
                checked={orderIndex === i}
                onChange={() => handleChangeOrder(i)}
              />
              <label htmlFor={o.name}>{o.text}</label>{" "}
            </div>
          ))}
        </div>
      </section>
      <section className="filter-sidebar__section">
        <h3 className="flex flex-b1">
          Price Range
          <span className="price-count bt-black flex flex-11">
            {Object.keys(priceRange).length || ""}
          </span>
        </h3>
        <div className="price-checks flex">
          {priceRangeOptions.map((pr, i) => (
            <div
              className="flex"
              key={i}
            >
              <input
                id={pr}
                type="checkbox"
                value={pr}
                onChange={() => handleChangePriceRange(pr)}
                checked={priceRange[pr]}
              />
              <label
                htmlFor={pr}
                className="price-checkbox"
              >
                {pr}
              </label>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
