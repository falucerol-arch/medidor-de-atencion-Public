function StatusPanel({
  rostroDetectado,
  direccion,
  atencion,
  estadoAnimo,
}) {
  const obtenerClaseAtencion = () => {
    if (atencion.level === "Alta") {
      return "alta";
    }

    if (atencion.level === "Media") {
      return "media";
    }

    if (atencion.level === "Baja") {
      return "baja";
    }

    return "";
  };

  return (
    <section className="info-card">
      <h2>Indicadores en tiempo real</h2>

      <div className="estado-box">
        <span>Rostro</span>

        <strong>
          {rostroDetectado
            ? "Detectado ✅"
            : "No detectado ❌"}
        </strong>
      </div>

      <div className="estado-box">
        <span>Dirección</span>
        <strong>{direccion}</strong>
      </div>

      <div className="estado-box">
        <span>Atención</span>

        <strong
          className={`texto-${obtenerClaseAtencion()}`}
        >
          {atencion.level}
        </strong>
      </div>

      <div className="estado-box">
        <span>Estado estimado</span>
        <strong>{estadoAnimo}</strong>
      </div>

      <div className="atencion-contenedor">
        <div className="barra">
          <div
            className={`barra-progreso ${obtenerClaseAtencion()}`}
            style={{
              width: `${atencion.percentage}%`,
            }}
          />
        </div>

        <strong className="porcentaje">
          {atencion.percentage}%
        </strong>
      </div>

      <p className="nota">
        El estado mostrado es una estimación basada
        en expresiones faciales.
      </p>
    </section>
  );
}

export default StatusPanel;