import { useModal } from "../../../context/Modal";

import "./ConfirmModal.css";

export function ConfirmModal({
  ConfirmBody,
  cancelText,
  confirmText,
  onCancel,
  onConfirm,
}) {
  const { closeModal, setModalClass } = useModal();
  setModalClass("flex flex-11");

  return (
    <div className="confirm-modal flex-c">
      {ConfirmBody}
      <div className="confirm__actions flex-c">
        <button
          className="bt-pd"
          onClick={() => (onCancel ? onCancel() : closeModal())}
        >
          {cancelText || "Cancel"}
        </button>
        <button
          className="bt-black bt-pd"
          onClick={() => {
            onConfirm();
            closeModal();
          }}
        >
          {confirmText}
        </button>
      </div>
    </div>
  );
}
