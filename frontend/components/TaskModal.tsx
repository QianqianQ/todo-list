import { useEffect } from 'react';

export default function Modal({ isOpen, onClose, children }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    } else {
      document.body.style.overflow = 'unset';
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50 backdrop-blur-sm">
      <div className="bg-white rounded-lg p-6 w-full max-w-md rounded-lg border-1">
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}