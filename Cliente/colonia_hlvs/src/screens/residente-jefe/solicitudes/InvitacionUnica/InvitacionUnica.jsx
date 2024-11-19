

const InvitacionUnica = ({ fecha, hora, nombre , status}) => {
    return (
        <>
            <h2 className="invitacion-tipo">Invitación Única</h2>
            <p className="invitacion-detalle"><strong>Fecha:</strong> {fecha}</p>
            <p className="invitacion-detalle"><strong>Hora:</strong> {hora}</p>
            <p className="invitacion-detalle"><strong>Nombre:</strong> {nombre}</p>
        </>
    )
}

export default InvitacionUnica;
