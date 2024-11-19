
const InvitacionRecurrente = ({ fechaInicio, fechaFin, hora, nombre, dias }) => {
    return (
        <>
            <h2 className="invitacion-tipo">Invitación Recurrente</h2>
            <p className="invitacion-detalle"><strong>Fecha:</strong> {fechaInicio} - {fechaFin}</p>
            <p className="invitacion-detalle"><strong>Hora:</strong> {hora}</p>
            <p className="invitacion-detalle"><strong>Nombre:</strong> {nombre}</p>
            <p className="invitacion-detalle"><strong>Días:</strong></p>
            <div className="days-container">
                {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(day => (
                    <span key={day} className={`day ${dias.includes(day) ? 'active' : ''}`}>{day}</span>
                ))}
            </div>
        </>
    )
}

export default InvitacionRecurrente;