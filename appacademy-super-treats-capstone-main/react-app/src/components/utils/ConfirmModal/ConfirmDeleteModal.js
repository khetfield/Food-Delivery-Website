import { ConfirmModal } from "./ConfirmModal";
import "./ConfirmModal.css";

const ConfirmDeleteBody = ({ deleteName }) => {
  return (
    <div className="confirm-delete flex-c">
      <h2>
        Are you sure you want to delete{" "}
        <span className="modal-highlight">{deleteName}</span>?
      </h2>
      <p>This is action cannot be undone</p>
    </div>
  );
};

export function ConfirmDeleteModal({ deleteName, onDelete, onCancel }) {
  const ConfirmBody = <ConfirmDeleteBody deleteName={deleteName} />;
  return (
    <ConfirmModal
      ConfirmBody={ConfirmBody}
      onConfirm={onDelete}
      confirmText={"Delete"}
      onCancel={onCancel}
    />
  );
}
