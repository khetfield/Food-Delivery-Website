import { NavLink, useRouteMatch } from "react-router-dom";
import "./ExpandingLink.css";

const ExpandingLink = ({ to, className, iconClass, text, children }) => {
  const atTargetPage = useRouteMatch(to);

  return (
    <>
      <NavLink
        to={to}
        className={className}
      >
        <i className={iconClass}></i>
        {text}
      </NavLink>
      <div className="expanding-link__children">{atTargetPage && children}</div>
    </>
  );
};

export default ExpandingLink;
