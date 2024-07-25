import "./SignupForm.css";

import React, { useState } from "react";
import { selectUser, signUp } from "../../../store/session";
import { useDispatch, useSelector } from "react-redux";

import DemoLogin from "../DemoLogin";
import HLine from "../../utils/HLine";
import PageHeader from "../../PageHeader";
import SignupFormEmail from "./SignupFormEmail";
import SignupFormName from "./SignupFormName";
import SignupFormPassword from "./SignupFormPassword";
import SignupFormPhone from "./SignupFormPhone";
import { useHistory } from "react-router-dom";

export default function SignupFormPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const sessionUser = useSelector(selectUser);
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [passwordStatus, setPasswordStatus] = useState({ fail: [] });
  const [errors, setErrors] = useState({});
  const [step, setStep] = useState(0);

  if (sessionUser) history.push("/");

  const validateMaxLength = (field, val, len, setter) => {
    const error = val.length > len ? "Max length reached" : "";
    setErrors((errors) => ({ ...errors, [`${field}`]: error }));

    if (error) return;
    else setter(val);
  };

  const formSteps = [
    SignupFormEmail,
    SignupFormPhone,
    SignupFormPassword,
    SignupFormName,
  ];

  const nextStep = () => {
    if (step < formSteps.length - 1) setStep((step) => step + 1);
    else handleSubmit();
  };

  const form = {
    email: { email, setEmail },
    phone: { phone, setPhone },
    firstName: { firstName, setFirstName },
    lastName: { lastName, setLastName },
    password: { password, setPassword, passwordStatus, setPasswordStatus },
    errors: { errors, setErrors },
    steps: { setStep, nextStep, isLast: step === formSteps.length - 1 },
    validateMaxLength,
  };

  const CurrentStep = formSteps[step];

  const handleSubmit = async (e) => {
    e && e.preventDefault();

    const user = {
      email,
      phone,
      password,
      first_name: firstName,
      last_name: lastName,
    };

    const res = await dispatch(signUp(user));
    if (res.errors) setErrors(res.errors);
    else history.push("/");
  };

  const handleLogin = (e) => {
    e.preventDefault();
    history.push("/login");
  };

  return (
    <div className="signup-page flex-c fh">
      <PageHeader
        backgroundColor="black"
        color="white"
        auth={false}
      />
      <div className="signup-content flex flex-11 fh">
        <form
          className="auth-form flex-c"
          onSubmit={handleSubmit}
          autoComplete="false"
        >
          <CurrentStep form={form} />
          <HLine
            text="or"
            width="80%"
          />
          <DemoLogin />
          <button
            type="submit"
            className="bt-black"
            onClick={handleLogin}
          >
            Already have an account
          </button>
        </form>
      </div>
    </div>
  );
}
