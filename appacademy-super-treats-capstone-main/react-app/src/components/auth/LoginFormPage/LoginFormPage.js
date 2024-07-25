import "./LoginForm.css";

import React, { useState } from "react";
import { login, selectUser } from "../../../store/session";
import { useDispatch, useSelector } from "react-redux";

import DemoLogin from "../DemoLogin";
import HLine from "../../utils/HLine";
import PageHeader from "../../PageHeader";
import { useHistory } from "react-router-dom";

const countries = ["US", "CA", "MX"];

export default function LoginFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(selectUser);
  const [credential, setCredential] = useState("");
  const [isPhone, setIsPhone] = useState(false);
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  if (sessionUser) history.push("/");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await dispatch(login(credential, password));
    if (res.errors)
      setErrors({ credential: "Invalid login", password: "Invalid login" });
    else history.push("/");
  };

  const handleSignup = (e) => {
    e.preventDefault();
    history.push("/signup");
  };

  const updateCredential = (e) => {
    const credential = e.target.value.trim();
    const is_phone =
      credential.length > 1 &&
      credential.search(/^(\d\s*\d|\(\s*\d)/) === 0 &&
      credential.search(/[a-zA-z@]/) === -1;

    setIsPhone(is_phone);

    const credential_error =
      (is_phone && credential.length > 20) || credential.length > 255
        ? "Max length reached"
        : "";

    setErrors((errors) => ({ ...errors, credential: credential_error }));

    if (credential_error) return;
    else setCredential(e.target.value);
  };

  const updatePassword = (e) => {
    const password = e.target.value;

    const password_error = password.length > 20 ? "Max length reached" : "";

    setErrors((errors) => ({ ...errors, password: password_error }));

    if (password_error) return;
    else setPassword(password);
  };

  return (
    <div className="login-page flex-c fh">
      <PageHeader
        backgroundColor="black"
        color="white"
        auth={false}
      />
      <div className="login-content flex flex-11 fh">
        <form
          className="auth-form flex-c"
          onSubmit={handleSubmit}
        >
          <h2>Log in with your email or phone number</h2>
          <div className="flex">
            {isPhone && (
              <select>
                {countries.map((c, i) => (
                  <option
                    value={c}
                    key={`${i}_${c}`}
                  >
                    {c}
                  </option>
                ))}
              </select>
            )}
            <input
              value={credential}
              onChange={updateCredential}
              placeholder="Enter phone number or email"
              autoFocus
              required
            />
          </div>
          <p className="auth-error">{errors.credential}</p>
          <input
            type="password"
            value={password}
            onChange={updatePassword}
            placeholder="Password"
            required
          />
          <p className="auth-error">{errors.password}</p>
          <button
            type="submit"
            className="bt-black"
          >
            Log In
          </button>
          <HLine
            text="or"
            width="80%"
          />
          <DemoLogin />
          <button
            type="submit"
            className="bt-black"
            onClick={handleSignup}
          >
            Create an account
          </button>
        </form>
      </div>
    </div>
  );
}
