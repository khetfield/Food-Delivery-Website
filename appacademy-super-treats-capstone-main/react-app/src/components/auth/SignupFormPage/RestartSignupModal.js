import { useHistory } from "react-router-dom";
import { useModal } from "../../../context/Modal";

export default function RestartSignupModal({ form }) {
  const history = useHistory();
  const { closeModal } = useModal();

  const handleRestart = () => {
    form.email.setEmail("");
    form.phone.setPhone("");
    form.firstName.setFirstName("");
    form.lastName.setLastName("");
    form.password.setPassword("");
    form.errors.setErrors({});
    form.steps.setStep(0);
    history.push("/signup");
    closeModal();
  };

  return (
    <div className="restart-signup-modal">
      <header>
        <h2>Start Over?</h2>
      </header>
      <div className="flex-c">
        <p>Are you sure you want to restart from the beginning?</p>
        <button
          className="bt-black bt-pd"
          onClick={handleRestart}
        >
          Yes
        </button>
        <button
          className="bt-pd"
          onClick={closeModal}
        >
          No
        </button>
      </div>
    </div>
  );
}
