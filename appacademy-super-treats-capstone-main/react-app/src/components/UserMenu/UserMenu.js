import "./UserMenu.css";

import LoggedInUserMenu from "./LoggedInUserMenu";
import LoggedOutUserMenu from "./LoggedOutUserMenu";
import { selectUser } from "../../store/session";
import { useSelector } from "react-redux";

export default function UserMenu() {
  const user = useSelector(selectUser);

  return (
    <div className="user-menu flex-c">
      {user ? <LoggedInUserMenu /> : <LoggedOutUserMenu />}
    </div>
  );
}
