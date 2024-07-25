import "./PageHeader.css";

import Logo from "../utils/Logo";
import UserMenu from "../UserMenu";
import { selectUser } from "../../store/session";
import { useHistory } from "react-router-dom";
import { useModal } from "../../context/Modal";
import { useSelector } from "react-redux";

export default function PageHeader({
  backgroundColor,
  color,
  highlight,
  auth,
}) {
  const history = useHistory();
  const { setModalContent, setModalClass } = useModal();

  const user = useSelector(selectUser);

  const openUserMenu = () => {
    setModalClass("");
    setModalContent(<UserMenu />);
  };

  return (
    <header
      className="page-header flex flex-b1 pg-pd"
      style={{ backgroundColor, color }}
    >
      <div className="header-left flex">
        <div
          className="header-menu"
          onClick={openUserMenu}
        >
          <i className="fa-solid fa-bars"></i>
        </div>
        <Logo
          color={color}
          highlight={highlight || color}
        />
      </div>
      <div className="header-right flex">
        {!user && auth && (
          <>
            <button
              className="header-login"
              onClick={() => history.push("/login")}
            >
              <i className="fa-solid fa-user"></i> Log in
            </button>
            <button
              className="header-signup bt-black"
              onClick={() => history.push("/signup")}
            >
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}
