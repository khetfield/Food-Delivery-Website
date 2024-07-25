import { useParams, NavLink } from "react-router-dom";
import Logo from "../../utils/Logo";
import "./BusinessMenu.css";
import ExpandingLink from "../../utils/ExpandingLink/ExpandingLink";

export default function BusinessMenu() {
  const { businessId } = useParams();

  return (
    <div className="business-menu flex-c">
      <section>
        <Logo highlight={"green"} />
        <NavLink
          exact
          to="/business"
          className="menu-link"
        >
          <i className="fa-solid fa-table"></i>
          Your Businesses
        </NavLink>
      </section>

      {businessId && (
        <section>
          <NavLink
            exact
            to={`/business/${businessId}`}
            className="menu-link"
          >
            <i className="fa-solid fa-house"></i>
            Overview
          </NavLink>
          <ExpandingLink
            to={`/business/${businessId}/menu`}
            className="menu-link"
            iconClass="fa-solid fa-utensils"
            text="Menu"
          >
            <section>
              <NavLink
                to={`/business/${businessId}/menu/items`}
                className="menu-link"
              >
                Items
              </NavLink>
              <NavLink
                to={`/business/${businessId}/menu/categories`}
                className="menu-link"
              >
                Categories
              </NavLink>
            </section>
          </ExpandingLink>
        </section>
      )}
    </div>
  );
}
