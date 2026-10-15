function AlertBanner({ mensaje }) {
  if (!mensaje) {
    return null;
  }

  return (
    <div className="alerta">
      {mensaje}
    </div>
  );
}

export default AlertBanner;