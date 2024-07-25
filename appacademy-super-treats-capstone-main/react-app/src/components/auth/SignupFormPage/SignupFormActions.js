import { useModal } from "../../../context/Modal";
import RestartSignupModal from "./RestartSignupModal";

export default function SignupFormActions({ submitAction, form }) {
  const { setModalContent, setModalClass } = useModal();

  const { isLast } = form.steps;

  const handleBack = (e) => {
    e.preventDefault();
    setModalClass("flex flex-11");
    setModalContent(<RestartSignupModal form={form} />);
  };

  return (
    <div className="signup-actions">
      <button
        className="signup-actions__button bt-black"
        onClick={submitAction}
      >
        {isLast ? "Submit" : "Next"}
      </button>
      <button
        className="signup-actions__button"
        onClick={handleBack}
      >
        <i className="fa-solid fa-arrow-left"></i>
      </button>
    </div>
  );
}
