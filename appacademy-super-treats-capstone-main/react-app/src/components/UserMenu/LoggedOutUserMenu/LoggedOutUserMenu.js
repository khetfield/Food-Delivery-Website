import { useModal } from "../../../context/Modal";
import { useHistory } from "react-router-dom";

import PersonalLinksSection from "../PersonalLinksSection";
import "./LoggedOutUserMenu.css";

export default function LoggedOutUserMenu() {
  const history = useHistory();
  const { closeModal } = useModal();

  const modalNavigate = (path) => {
    closeModal();
    history.push(path);
  };

  return (
    <>
      <section className="menu-section">
        <button
          className="user-menu__login bt-black"
          onClick={() => modalNavigate("/signup")}
        >
          Sign up
        </button>
        <button
          className="user-menu__login"
          onClick={() => modalNavigate("/login")}
        >
          Log in
        </button>
      </section>
      <PersonalLinksSection />
    </>
  );
}
