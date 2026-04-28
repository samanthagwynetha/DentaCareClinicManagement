"use client";

type Props = {
  isOpen: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
};

export default function ConfirmDialog({
  isOpen,
  title,
  message,
  onConfirm,
  onCancel,
  confirmText = "Confirm",
  cancelText = "Cancel",
  isDestructive = false,
}: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Blurred Backdrop */}
      <div 
        className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm transition-opacity" 
        onClick={onCancel}
      />
      
      {/* Modal Dialog */}
      <div className="bg-white rounded-3xl w-full max-w-sm shadow-2xl z-10 overflow-hidden transform transition-all">
        <div className="px-6 pt-8 pb-6 flex flex-col items-center text-center">
          {/* Icon */}
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-5 ${
            isDestructive ? "bg-red-50 text-red-500" : "bg-teal-50 text-teal-500"
          }`}>
            {isDestructive ? (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            ) : (
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </div>
          
          {/* Text Content */}
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{message}</p>
        </div>

        {/* Buttons */}
        <div className="px-6 pb-8 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 px-4 py-3 rounded-xl border border-gray-200 text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-300 transition-colors"
          >
            {cancelText}
          </button>
          <button
            onClick={onConfirm}
            className={`flex-1 px-4 py-3 rounded-xl font-semibold text-white shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5 ${
              isDestructive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-teal-500 hover:bg-teal-600"
            }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
