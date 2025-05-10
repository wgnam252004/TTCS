import { useState, useEffect } from "react";

import { useContextState } from "./useContextState";

// Creamos el hook para simular el login a un api
export const useLogin = () => {
  // Obtenemos el estado compartido que guarda los datos del usuario iniciado
  const [user, setUser] = useContextState("user");
  // Obtenemos los estados compartidos sobre la captura del usuario
  const [username] = useContextState("username");
  const [password] = useContextState("password");
  const [userCaptured] = useContextState("userCaptured");
  // Marcamos dos estados para informar el progreso del hook
  const [complete, setComplete] = useState(false);
  const [status, setStatus] = useState("iniciando sesión...");
  // Usamos un efecto que consuma el api
  useEffect(() => {
    // Si el usuario aún no está capturado ignoramos
    if (!userCaptured) {
      setStatus("Esperando captura de datos");
      return;
    }
    // Marcamos estado de que se está comunicando con el api
    setStatus("Llamando al API de login...");
    // Creamos un timeout que simule que tarda 2 segundos el api
    const id = setTimeout(() => {
      // Simulamos que se comparan las credenciales
      if (username !== "aura" || password !== "aura123") {
        // Si no coinciden grabamos el estado completo
        setStatus("Las credenciales no son válidas");
        setComplete(true);
        return;
      }
      // Si coinciden grabamos el usuario y el estado completo
      setUser({
        name: username,
        email: `${username}@gmail.com`,
        last_login: new Date()
      });
    }, 2000);
    return () => {
      // Borramos el timeout en caso que se cancele el efecto
      clearTimeout(id);
    };
  }, [userCaptured, username, password, setUser]);

  useEffect(() => {
    if (user) {
      setStatus("Usuario encontrado");
      setComplete(true);
    }
  }, [user]);

  // Devolvemos el estado del hook (si está completo y el estatus)
  return [complete, status];
};
