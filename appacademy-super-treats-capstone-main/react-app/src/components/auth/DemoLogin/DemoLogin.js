import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import { login } from "../../../store/session";
import "./DemoLogin.css";

export default function DemoLogin() {
  const dispatch = useDispatch();
  const history = useHistory();

  const demoLogin = async (e) => {
    e.preventDefault();
    await dispatch(login("demo@aa.io", "password"));
    history.push("/");
  };

  return (
    <div className="demo-login flex-c">
      <button
        onClick={demoLogin}
        className="bt-black"
      >
        Login as Demo User
      </button>
    </div>
  );
}
