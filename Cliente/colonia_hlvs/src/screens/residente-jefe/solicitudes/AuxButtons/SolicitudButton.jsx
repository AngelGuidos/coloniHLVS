

const SolicitudButton = ({ onAceptar, onRechazar }) => {
    return (
        <div className="button-contenedor">
            <button className="rechazar-button" onClick={onRechazar}>Rechazar</button>
            <button className="aceptar-button" onClick={onAceptar}>Aceptar</button>
        </div>
    )
}

export default SolicitudButton;