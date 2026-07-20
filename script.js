const apirender = "https://speech-detector.onrender.com";
let microfonoActivo = false;
const boton = document.getElementById("toggleMic");
const estadoMic = document.getElementById("microfonoEstado");
const estado = document.getElementById("estado");
const idioma = document.getElementById("idioma");
const original = document.getElementById("original");
const traducido = document.getElementById("traducido");
let escuchando = false;
const palabraActivacion = "escuchar";
const palabraDetener = "para";
const palabraDetenerFinal = "finalizar";
let activo = true;
let temporizador = null;
const radios = document.querySelector(".radio");
const radioEspañol = document.querySelector("#Español");
const radioPortugues = document.querySelector("#Portugues");

document.addEventListener("DOMContentLoaded", () => {
  temporizador = setTimeout(() => {
    if (radioPortugues.checked) {
      reconocimiento.lang = "pt-BR";
    }
    if (radioEspañol.checked) {
      reconocimiento.lang = "es-ES";
    }
    if (radioEspañol.checked || radioPortugues.checked) {
      activo = true;
      iniciarMicrofono();
    }
  }, 10000);
});

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const reconocimiento = new SpeechRecognition();

reconocimiento.continuous = true;
reconocimiento.interimResults = false;
// reconocimiento.interimResults = true;

// escucha directamente portugués BR
// if (radioPortugues.checked) {
//   reconocimiento.lang = "pt-BR";
// }
// if (radioEspañol.checked) {
//   reconocimiento.lang = "es-ES";
// }

reconocimiento.onstart = () => {
  microfonoActivo = true;

  estado.innerHTML = "🟢 Escuchando...";
  estado.title = "El micrófono esta activo y escuchando.";

  estadoMic.innerHTML = "🟢 Micrófono activado";
  estadoMic.className = "encendido";

  boton.innerHTML = "⛔ Desactivar micrófono";
};

// reconocimiento.onend = () => {
//   microfonoActivo = false;

//   estado.innerHTML = "🔴 Detenido";

//   estadoMic.innerHTML = "🔴 Micrófono desactivado";
//   estadoMic.className = "apagado";

//   boton.innerHTML = "🎤 Activar micrófono";
// };

reconocimiento.onend = () => {
  microfonoActivo = false;

  estado.innerHTML = "🔴 Detenido";

  estadoMic.innerHTML = "🔴 Micrófono desactivado";
  estadoMic.className = "apagado";

  boton.innerHTML = "🎤 Activar micrófono";
  if (activo) {
    iniciarMicrofono();
  }

  // Si el usuario no lo apagó, volver a escuchar
  //   if (escuchando) {
  //     setTimeout(() => {
  //       try {
  //         reconocimiento.start();
  //       } catch {}
  //     }, 300);
  //   }
};

// reconocimiento.onresult = async (e) => {
//   let texto = e.results[e.results.length - 1][0].transcript;

//   original.innerHTML = texto;

//   idioma.innerHTML = "Portugués (Brasil)";

//   traducir(texto);
// };

reconocimiento.onresult = async (e) => {
  let resultado = e.results[e.results.length - 1];
  console.log("Resultado:", resultado);

  let texto = resultado[0].transcript.toLowerCase().trim();
  if (activo) {
    if (texto.includes(palabraDetener)) {
      detenerMicrofono();
      return;
    } else if (texto.includes(palabraDetenerFinal)) {
      detenerMicrofonoCompleto();
      return;
    }
  } else {
    if (texto.includes(palabraActivacion)) {
      activo = true;
      console.log("Activado nuevamente");
    }
  }
  const idioma2 = await detectarIdioma(texto);
  if (idioma2 !== "PT") {
    //console.log("Idioma detectado:", idioma2);
    idioma.textContent = `Idioma detectado: ${idioma2}`;
    original.textContent = texto;
    traducido.textContent = "No se traducirá porque no es portugués.";
    return; // No traducir si no es portugués
  } else {
    //console.log("Idioma detectado:", idioma2);
    original.textContent = texto;

    // Solo traducir cuando la frase terminó
    //if (!resultado.isFinal) return;

    idioma.textContent = "Portugués (Brasil)";

    traducir(texto);
  }
};

async function traducir(texto) {
  try {
    const respuesta = await fetch(`${apirender}/traducir`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        texto: texto,
      }),
    });

    const datos = await respuesta.json();
    console.log("Datos recibidos:", datos);
    console.log(datos.idioma, datos.traducido);

    if (datos.error) {
      throw new Error(datos.error);
    }

    traducido.textContent = datos.traducido;
  } catch (error) {
    console.error(error);
    traducido.textContent = "Error al traducir";
  }
}

async function detectarIdioma(texto) {
  const respuesta = await fetch(`${apirender}/detectar`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      texto,
    }),
  });

  const datos = await respuesta.json();
  console.log("Idioma detectado:", datos.idioma);
  console.log(datos);

  return datos.idioma;
}

function iniciarMicrofono() {
  try {
    reconocimiento.start();
    console.log("Micrófono iniciado");
  } catch (e) {}
}

function detenerMicrofono() {
  activo = false;
  reconocimiento.stop();
  idioma.textContent = "";
  original.textContent = "";
  traducido.textContent = "";
  console.log("Micrófono detenido");
  reproducirAudio("Sound/Detenido.webm");
  estado.title = "El micrófono se ha detenido. Puede activarlo nuevamente.";

  // Reactivar automáticamente después de 10 segundos
  temporizador = setTimeout(() => {
    activo = true;
    iniciarMicrofono();
  }, 10000);
}

function detenerMicrofonoCompleto() {
  activo = false;
  reconocimiento.stop();
  idioma.textContent = "";
  original.textContent = "";
  traducido.textContent = "";
  if (radioEspañol.checked) {
    radioEspañol.checked = false;
  }
  if (radioPortugues.checked) {
    radioPortugues.checked = false;
  }
  //async () => {
  reproducirAudio("Sound/Finalizado.webm");
  //};
  console.log("Micrófono detenido completo");
  estado.title =
    "El micrófono se ha detenido completamente. Puede activarlo nuevamente.";

  //   // Reactivar automáticamente después de 10 segundos
  //   temporizador = setTimeout(() => {
  //     activo = true;
  //     iniciarMicrofono();
  //   }, 10000);
}

// boton.onclick = () => {
//   if (!microfonoActivo) {
//     reconocimiento.start();
//   } else {
//     reconocimiento.stop();
//   }
// };

boton.onclick = () => {
  if (radioEspañol.checked === true || radioPortugues.checked === true) {
    escuchando = !escuchando;

    if (escuchando) {
      reconocimiento.start();
    } else {
      reconocimiento.stop();
    }
  }
};

async function reproducirAudio(ruta) {
  const audio = new Audio(ruta);
  audio.play().catch((error) => {
    console.error("No se pudo reproducir el audio:", error);
  });
}
