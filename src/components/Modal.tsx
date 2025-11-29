import type { FC, ReactNode } from "react";

interface ModalProps {
  children: ReactNode;
  onClose: () => void;
  title?: string;
}

const Modal: FC<ModalProps> = ({ children, onClose, title }) => {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      aria-modal="true"
      role="dialog"
    >
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
        onClick={onClose}
        aria-hidden="true"
      />

      <div
        className="relative w-full max-w-3xl mx-4 bg-transparent z-50"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {title && (
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
            </div>
          )}
          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
