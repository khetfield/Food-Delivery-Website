import SignupFormActions from "./SignupFormActions";

export default function SignupFormPassword({ form }) {
  const { password, setPassword, passwordStatus, setPasswordStatus } =
    form.password;
  const { nextStep, isLast } = form.steps;

  const validatePassword = (e) => {
    const password = e.target.value;
    const passwordStatus = { pass: [], fail: [] };
    passwordStatus[
      password.length >= 8 && password.length <= 40 ? "pass" : "fail"
    ].push("Password is between 8 and 40 characters");
    passwordStatus[password.match(/[a-zA-Z]/) ? "pass" : "fail"].push(
      "Password contains a letter"
    );
    passwordStatus[password.match(/\d/) ? "pass" : "fail"].push(
      "Password contains a number"
    );
    setPasswordStatus(passwordStatus);
  };

  const submitPassword = (e) => {
    e.preventDefault();

    if (passwordStatus.fail.length === 0) nextStep();
  };

  return (
    <section className="signup-form__section">
      <h2>Create your account password</h2>
      <p>
        Your password must be at least 8 characters long and contain at least
        one letter and one digit
      </p>
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={(e) => {
          setPassword(e.target.value);
          validatePassword(e);
        }}
        onFocus={validatePassword}
        onBlur={validatePassword}
        autoFocus
        required
      />
      <p></p>
      {passwordStatus.fail.length !== 0 && (
        <>
          {passwordStatus.fail.map((msg, i) => (
            <p
              key={i}
              className="flex g10"
            >
              <i className="fa-solid fa-circle-xmark red-icon"></i>
              {msg}
            </p>
          ))}
          {passwordStatus.pass.map((msg, i) => (
            <p
              key={i}
              className="flex g10"
            >
              <i className="fa-solid fa-circle-check green-icon"></i>
              {msg}
            </p>
          ))}
        </>
      )}
      <SignupFormActions
        submitAction={submitPassword}
        form={form}
      />
    </section>
  );
}
