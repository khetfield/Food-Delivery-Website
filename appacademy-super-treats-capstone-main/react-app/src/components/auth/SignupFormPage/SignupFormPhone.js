import { useDispatch } from "react-redux";
import { validatePhone } from "../../../store/session";
import SignupFormActions from "./SignupFormActions";

export default function SignupFormPhone({ form }) {
  const dispatch = useDispatch();
  const { phone, setPhone } = form.phone;
  const { errors, setErrors } = form.errors;
  const { nextStep, isLast } = form.steps;
  const { validateMaxLength } = form;

  const submitPhone = async (e) => {
    e.preventDefault();
    const res = await dispatch(validatePhone(phone));
    if (res.errors) setErrors(res.errors);
    else nextStep();
  };

  return (
    <section className="signup-form__section">
      <h2>What is your phone number?</h2>
      <input
        type="text"
        placeholder="Enter your phone number"
        value={phone}
        onChange={(e) =>
          validateMaxLength("phone", e.target.value, 20, setPhone)
        }
        autoFocus
        required
      />
      <p className="auth-error">{errors.phone}</p>
      <SignupFormActions
        submitAction={submitPhone}
        form={form}
      />
    </section>
  );
}
