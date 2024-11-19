import "./ConfirmationView.css";

const ConfirmationView = () => {
  return (
    <div className="login-confirmation-container">
      <div className="text-center">
        <div className="confirmation-alert success">
          <h1 className="confirmation-title">Acceso Permitido</h1>
          <svg
            className="confirmation-icon"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="#007bff" />
            <path
              d="M50,50 L70,70 L30,30 L50,50 Z"
              fill="#ffffff"
              stroke="#007bff"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationView;
