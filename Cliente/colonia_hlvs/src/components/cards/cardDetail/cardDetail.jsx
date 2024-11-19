import "./cardDetail.css";

function CardDetail({ title, date, time, onClick, isSelected }) {
  return (
    <div className="card-container" onClick={onClick}>
      <div className="contentCard">
        <h1>Casa #{title}</h1>
        {isSelected && (
          <div className="qr-reminder">
            Recuerda generar el código QR cuando esté cerca de la hora adecuada,
            y escanéala frente a la pluma para poder entrar a la residencia.
          </div>
        )}
        <div className="down-container">
          <div className="dia-container">
            <h2>Dia:</h2>
            <div className="text">{date}</div>
          </div>
          <div>
            <h2>Hora:</h2>
            <div className="text">{time}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CardDetail;
