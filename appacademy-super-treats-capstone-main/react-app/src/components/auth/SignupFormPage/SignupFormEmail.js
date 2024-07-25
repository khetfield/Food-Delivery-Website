import { useDispatch } from "react-redux";
import { validateEmail } from "../../../store/session";
import SignupFormActions from "./SignupFormActions";

export default function SignupFormEmail({ form }) {
  const dispatch = useDispatch();
  const { email, setEmail } = form.email;
  const { errors, setErrors } = form.errors;
  const { nextStep, isLast } = form.steps;
  const { validateMaxLength } = form;

  const submitEmail = async (e) => {
    e.preventDefault();
    const res = await dispatch(validateEmail(email));
    if (res.errors) setErrors(res.errors);
    else nextStep();
  };

  return (
    <section className="signup-form__section">
      <h2>What is your email address?</h2>
      <input
        type="email"
        placeholder="Enter your email address"
        value={email}
        onChange={(e) =>
          validateMaxLength("email", e.target.value, 255, setEmail)
        }
        autoFocus
        required
      />
      <p className="auth-error">{errors.email}</p>
      <SignupFormActions
        submitAction={submitEmail}
        form={form}
      />
    </section>
  );
}
