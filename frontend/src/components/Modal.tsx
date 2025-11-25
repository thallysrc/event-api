import React from "react";

type ModalProps = {
  title?: string;
  onClose?: () => void;
  children?: React.ReactNode;
};

export default function Modal({ title, onClose, children }: ModalProps) {
  return (
    <div className="modal-overlay">
      <div className="modal-card">
        {onClose && (
          <button onClick={onClose} className="btn-fechar-modal">
            <i data-lucide="x"></i>
          </button>
        )}
        {title && <h2>{title}</h2>}
        {children}
      </div>
    </div>
  );
}
