import "./DeniedView.css";

const DeniedView = () => {
  return (
    <div className="login-access-denied-container">
      <div className="text-center">
        <div className="denied-alert danger">
          <h1 className="access-denied-title">Acceso Denegado</h1>
          <svg
            className="access-denied-icon"
            width="100"
            height="100"
            viewBox="0 0 100 100"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="50" cy="50" r="40" fill="#dc3545" />
            <path
              d="M20,50 L80,50"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M50,20 L50,80"
              stroke="#ffffff"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
};

export default DeniedView;
