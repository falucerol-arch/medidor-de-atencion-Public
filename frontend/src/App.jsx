import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  CameraManager,
} from "./services/CameraManager";

import {
  FaceAnalyzer,
} from "./services/FaceAnalyzer";

import {
  ExamMonitor,
} from "./services/ExamMonitor";

import CameraPanel from "./components/CameraPanel";
import StatusPanel from "./components/StatusPanel";
import AlertBanner from "./components/AlertBanner";

import "./App.css";

function App() {
  const videoRef = useRef(null);

  const cameraManagerRef = useRef(null);

  const faceAnalyzerRef = useRef(
    new FaceAnalyzer()
  );

  const examMonitorRef = useRef(
    new ExamMonitor({
      deviationTime: 2000,
      alertCooldown: 5000,
    })
  );

  const animationFrameRef = useRef(null);

  const ultimoAnalisisRef = useRef(0);

  const [iaLista, setIaLista] =
    useState(false);

  const [camaraActiva, setCamaraActiva] =
    useState(false);

  const [
    rostroDetectado,
    setRostroDetectado,
  ] = useState(false);

  const [
    direccion,
    setDireccion,
  ] = useState("Sin datos");

  const [
    estadoAnimo,
    setEstadoAnimo,
  ] = useState("Sin datos");

  const [
    atencion,
    setAtencion,
  ] = useState({
    level: "Sin datos",
    percentage: 0,
  });

  const [
    alerta,
    setAlerta,
  ] = useState("");

  /*
   * Inicializar MediaPipe
   */
  useEffect(() => {
    const iniciarIA = async () => {
      try {
        await faceAnalyzerRef.current.initialize();

        setIaLista(true);

        console.log(
          "FaceAnalyzer inicializado correctamente"
        );
      } catch (error) {
        console.error(
          "Error inicializando FaceAnalyzer:",
          error
        );
      }
    };

    iniciarIA();
  }, []);

  /*
   * Detectar cambio de pestaña
   */
  useEffect(() => {
    const detectarCambioPestana = () => {
      if (document.hidden) {
        examMonitorRef.current.registerTabChange();

        setAlerta(
          "⚠️ No cambie de pestaña durante el examen."
        );
      }
    };

    document.addEventListener(
      "visibilitychange",
      detectarCambioPestana
    );

    return () => {
      document.removeEventListener(
        "visibilitychange",
        detectarCambioPestana
      );
    };
  }, []);

  /*
   * Limpiar cámara cuando
   * se cierre el componente
   */
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(
          animationFrameRef.current
        );
      }

      cameraManagerRef.current?.stop();
    };
  }, []);

  /*
   * Iniciar cámara
   */
  const iniciarCamara = async () => {
    try {
      cameraManagerRef.current =
        new CameraManager(
          videoRef.current
        );

      await cameraManagerRef.current.start();

      setCamaraActiva(true);

      videoRef.current.onloadeddata = () => {
        analizarVideo();
      };
    } catch (error) {
      console.error(
        "Error iniciando cámara:",
        error
      );

      alert(
        "No se pudo acceder a la cámara."
      );
    }
  };

  /*
   * Analizar cámara continuamente
   */
  const analizarVideo = () => {
    const video = videoRef.current;

    if (!video) {
      return;
    }

    /*
     * Analizamos unas pocas veces
     * por segundo para evitar
     * consumir demasiados recursos.
     */
    const ahora = performance.now();

    if (
      ahora -
        ultimoAnalisisRef.current >
      150
    ) {
      ultimoAnalisisRef.current = ahora;

      if (video.readyState >= 2) {
        analizarFrame(video);
      }
    }

    animationFrameRef.current =
      requestAnimationFrame(
        analizarVideo
      );
  };

  /*
   * Procesar un frame
   */
  const analizarFrame = (video) => {
    const resultado =
      faceAnalyzerRef.current.analyze(
        video
      );

    if (!resultado) {
      return;
    }

    const hayRostro =
      faceAnalyzerRef.current.hasFace(
        resultado
      );

    setRostroDetectado(
      hayRostro
    );

    /*
     * No hay rostro
     */
    if (!hayRostro) {
      setDireccion(
        "Sin rostro"
      );

      setAtencion({
        level: "Sin datos",
        percentage: 0,
      });

      setEstadoAnimo(
        "Sin datos"
      );

      const advertencia =
        examMonitorRef.current.checkLookDirection(
          "Sin rostro"
        );

      if (advertencia) {
        setAlerta(
          advertencia
        );
      }

      return;
    }

    /*
     * Dirección de la cabeza
     */
    const nuevaDireccion =
      faceAnalyzerRef.current.getDirection(
        resultado
      );

    setDireccion(
      nuevaDireccion
    );

    /*
     * Atención
     */
    const nuevaAtencion =
      faceAnalyzerRef.current.getAttention(
        nuevaDireccion
      );

    setAtencion(
      nuevaAtencion
    );

    /*
     * Estado de ánimo estimado
     */
    const nuevoEstado =
      faceAnalyzerRef.current.getMood(
        resultado
      );

    setEstadoAnimo(
      nuevoEstado
    );

    /*
     * Supervisión del examen
     */
    const advertencia =
      examMonitorRef.current.checkLookDirection(
        nuevaDireccion
      );

    if (advertencia) {
      setAlerta(
        advertencia
      );
    }

    if (
      nuevaDireccion === "Al frente"
    ) {
      setAlerta("");
    }
  };

  return (
    <main className="app">
      <header>
        <h1>ClassFocus</h1>

        <p className="subtitulo">
          Sistema inteligente de supervisión
          y análisis estudiantil
        </p>
      </header>

      <AlertBanner
        mensaje={alerta}
      />

      <div className="panel-principal">
        <CameraPanel
          videoRef={videoRef}
          camaraActiva={camaraActiva}
          iaLista={iaLista}
          iniciarCamara={iniciarCamara}
        />

        <StatusPanel
          rostroDetectado={
            rostroDetectado
          }
          direccion={direccion}
          atencion={atencion}
          estadoAnimo={estadoAnimo}
        />
      </div>
    </main>
  );
}

export default App;