import "./ErrorPopup.css";

function ErrorPopup({ isOpen, message, onOk, onRetry }) {
  if (!isOpen) return null;

  return (
    <div className="error-popup-overlay">
      <div className="error-popup-modal" role="alertdialog" aria-modal="true" aria-labelledby="error-popup-title">
        <div className="error-popup__icon">
          ⚠️
        </div>
        <h3 id="error-popup-title" className="error-popup__title">
          Action Failed
        </h3>
        <p className="error-popup__message">
          {message}
        </p>
        <div className="error-popup__actions">
          <button 
            type="button" 
            className="error-popup__btn error-popup__btn--retry" 
            onClick={onRetry}
          >
            Retry
          </button>
          <button 
            type="button" 
            className="error-popup__btn error-popup__btn--ok" 
            onClick={onOk}
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

export default ErrorPopup;
