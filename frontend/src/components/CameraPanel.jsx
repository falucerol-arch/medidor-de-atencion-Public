function CameraPanel({
  videoRef,
  camaraActiva,
  iaLista,
  iniciarCamara,
}) {
  return (
    <section className="camara-card">
      <h2>Cámara</h2>

      <div className="camara">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
        />
      </div>

      <button
        onClick={iniciarCamara}
        disabled={!iaLista || camaraActiva}
      >
        {!iaLista
          ? "Cargando IA..."
          : camaraActiva
          ? "Cámara activa"
          : "Activar cámara"}
      </button>
    </section>
  );
}

export default CameraPanel;