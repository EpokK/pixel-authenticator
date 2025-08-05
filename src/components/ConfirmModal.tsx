import React from 'react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger'
}) => {
  if (!isOpen) return null;

  const getButtonStyles = () => {
    switch (type) {
      case 'danger':
        return 'bg-pixel-red hover:bg-pixel-purple text-pixel-text border-pixel-red';
      case 'warning':
        return 'bg-pixel-orange hover:bg-pixel-yellow text-pixel-bg border-pixel-orange';
      case 'info':
        return 'bg-pixel-primary hover:bg-pixel-secondary text-pixel-text border-pixel-primary';
      default:
        return 'bg-pixel-red hover:bg-pixel-purple text-pixel-text border-pixel-red';
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 bg-pixel-bg bg-opacity-90 transition-opacity" onClick={onCancel}></div>
        
        <span className="hidden sm:inline-block sm:align-middle sm:h-screen">&#8203;</span>
        
        <div className="inline-block align-bottom bg-pixel-surface rounded-pixel text-left overflow-hidden shadow-pixel-lg transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border-2 border-pixel-text">
          <div className="bg-pixel-surface px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-pixel bg-pixel-red border-2 border-pixel-text sm:mx-0 sm:h-10 sm:w-10">
                <svg 
                  className="h-6 w-6 text-pixel-text" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </div>
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 className="text-lg leading-6 font-pixel font-bold text-pixel-text">
                  {title.toUpperCase()}
                </h3>
                <div className="mt-2">
                  <p className="text-sm font-pixel text-pixel-muted">
                    {message}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-pixel-bg px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse border-t-2 border-pixel-text">
            <button
              type="button"
              className={`w-full inline-flex justify-center rounded-pixel border-2 shadow-pixel px-4 py-2 text-base font-pixel font-bold hover:shadow-pixel-inset focus:outline-none transition-all duration-150 sm:ml-3 sm:w-auto sm:text-sm ${getButtonStyles()}`}
              onClick={onConfirm}
            >
              {confirmText.toUpperCase()}
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-pixel border-2 border-pixel-text shadow-pixel px-4 py-2 bg-pixel-primary text-base font-pixel font-bold text-pixel-text hover:bg-pixel-secondary hover:shadow-pixel-inset focus:outline-none transition-all duration-150 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onCancel}
            >
              {cancelText.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;