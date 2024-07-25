import "./BusinessBrowsingPage.css";

import {
  fetchAllBusinesses,
  selectAllBusinesses,
  selectBusinessFilters,
  selectBusinessOrderingIndex,
  selectBusinessStatus,
} from "../../store/businesses";
import { useDispatch, useSelector } from "react-redux";
import { useCallback, useEffect, useMemo, useState } from "react";
import { orderOptions } from "./FilterSidebar/FilterSidebar";

import BusinessCard from "./BusinessCard";
import CartMenu from "../CartMenu";
import FilterIcon from "./FilterIcon/FilterIcon";
import FilterSidebar from "./FilterSidebar";
import PageHeader from "../PageHeader";

const filterCategories = {
  Grocery: "filter-icons/grocery.png",
  Convenience: "filter-icons/convenience.png",
  Pharmacy: "filter-icons/pharmacy.png",
  Alcohol: "filter-icons/alcohol.png",
  BBQ: "filter-icons/bbq.png",
  Breakfast: "filter-icons/breakfast.png",
  "Fast Food": "filter-icons/fast-food.png",
  "Pet Supplies": "filter-icons/pet-supplies.png",
  Flowers: "filter-icons/flowers.png",
  Asian: "filter-icons/asian.png",
  Indian: "filter-icons/indian.png",
  Seafood: "filter-icons/seafood.png",
  Pizza: "filter-icons/pizza.png",
  Sushi: "filter-icons/sushi.png",
  "Coffee and Tea": "filter-icons/coffee-tea.png",
  Healthy: "filter-icons/healthy.png",
  "Ice Cream + Frozen Yogurt": "filter-icons/ice-cream-frozen-yogurt.png",
  Desserts: "filter-icons/desserts.png",
};

export default function BusinessBrowsingPage() {
  const dispatch = useDispatch();

  const businessStatus = useSelector(selectBusinessStatus);
  const allBusinesses = useSelector(selectAllBusinesses);
  const orderingIndex = useSelector(selectBusinessOrderingIndex);
  const businessFilters = useSelector(selectBusinessFilters);

  const [orderedBusinesses, setOrderedBusinesses] = useState([]);
  const [filteredBusinesses, setFilteredBusinesses] = useState([]);

  useEffect(() => {
    if (businessStatus === "idle") {
      dispatch(fetchAllBusinesses());
    }
  }, [dispatch, businessStatus]);

  useEffect(() => {
    const sorted = sortBusinesses();
    setOrderedBusinesses(sorted);
  }, [orderingIndex, allBusinesses]);

  useEffect(() => {
    if (!businessFilters) {
      setFilteredBusinesses(orderedBusinesses);
    } else {
      const priceRanges = new Set(businessFilters.split("."));
      setFilteredBusinesses(
        orderedBusinesses.filter((id) =>
          priceRanges.has(allBusinesses[id].priceRange)
        )
      );
    }
  }, [orderedBusinesses, businessFilters]);

  const sortBusinesses = () => {
    if (orderingIndex !== undefined && allBusinesses) {
      return Object.values(allBusinesses)
        .sort((a, b) => {
          const { property, desc } = orderOptions[orderingIndex];
          return (property(a) > property(b) ? 1 : -1) * (desc ? -1 : 1);
        })
        .map((b) => b.id);
    } else {
      return orderedBusinesses;
    }
  };

  return (
    <div className="business-browsing flex-c">
      <CartMenu />
      <header className="business-browsing__header">
        <PageHeader auth={true} />
        <div className="pg-pd">
          <div className="filter-bar flex g10">
            {Object.keys(filterCategories).map((cat, i) => (
              <FilterIcon
                text={cat}
                key={i}
                src={filterCategories[cat]}
              />
            ))}
          </div>
        </div>
      </header>
      <div className="business-browsing__body flex pg-pd">
        <FilterSidebar />
        <div className="business-browsing__content fw">
          {filteredBusinesses.map((businessId) => (
            <BusinessCard
              business={allBusinesses[businessId]}
              isBrowsing={true}
              key={businessId}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
