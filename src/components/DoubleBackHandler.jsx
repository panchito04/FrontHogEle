import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function DoubleBackHandler() {
  const navigate = useNavigate();
  const [pressed, setPressed] = useState(false);

  useEffect(() => {
    // Añade un estado artificial al historial
    window.history.pushState(null, "", window.location.href);

    const handleBack = () => {
      if (!pressed) {
        setPressed(true);

        // Evita que vaya atrás inmediatamente
        window.history.pushState(null, "", window.location.href);

        // Opcional: muestra mensaje
        // alert("Presiona atrás otra vez para volver");

        // Se reinicia después de 1.5 segundos
        setTimeout(() => setPressed(false), 1500);
      } else {
        // Ahora sí retrocede
        navigate(-1);
      }
    };

    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [pressed, navigate]);

  return null;
}
