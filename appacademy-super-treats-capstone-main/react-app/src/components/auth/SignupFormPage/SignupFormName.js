import SignupFormActions from "./SignupFormActions";

export default function SignupFormName({ form }) {
  const { firstName, setFirstName } = form.firstName;
  const { lastName, setLastName } = form.lastName;
  const { errors } = form.errors;
  const { nextStep, isLast } = form.steps;
  const { validateMaxLength } = form;

  return (
    <section className="signup-form__section">
      <h2>What is your name?</h2>
      <p>Let us know how to properly address you</p>
      <input
        type="text"
        placeholder="Enter first name"
        value={firstName}
        onChange={(e) =>
          validateMaxLength("firstName", e.target.value, 255, setFirstName)
        }
        autoFocus
        required
      />
      <p className="auth-error">{errors.firstName}</p>

      <input
        type="text"
        placeholder="Enter last name"
        value={lastName}
        onChange={(e) =>
          validateMaxLength("lastName", e.target.value, 255, setLastName)
        }
        required
      />
      <p className="auth-error">{errors.lastName}</p>
      <SignupFormActions
        submitAction={nextStep}
        form={form}
      />
    </section>
  );
}
