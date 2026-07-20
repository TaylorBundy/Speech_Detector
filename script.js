const apirender = "https://speech-detector.onrender.com";
let microfonoActivo = false;
const boton = document.getElementById("toggleMic");
const estadoMic = document.getElementById("microfonoEstado");
const estado = document.getElementById("estado");
const idioma = document.getElementById("idioma");
const original = document.getElementById("original");
const traducido = document.getElementById("traducido");
let escuchando = false;

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const reconocimiento = new SpeechRecognition();

reconocimiento.continuous = true;
reconocimiento.interimResults = false;
// reconocimiento.interimResults = true;

// escucha directamente portugués BR
reconocimiento.lang = "pt-BR";

reconocimiento.onstart = () => {
  microfonoActivo = true;

  estado.innerHTML = "🟢 Escuchando...";

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

  // Si el usuario no lo apagó, volver a escuchar
  if (escuchando) {
    setTimeout(() => {
      try {
        reconocimiento.start();
      } catch {}
    }, 300);
  }
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

  let texto = resultado[0].transcript;
  const idioma2 = await detectarIdioma(texto);
  console.log("Idioma detectado:", idioma2);

  original.textContent = texto;

  // Solo traducir cuando la frase terminó
  if (!resultado.isFinal) return;

  idioma.textContent = "Portugués (Brasil)";

  traducir(texto);
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

  return datos.idioma;
}

// boton.onclick = () => {
//   if (!microfonoActivo) {
//     reconocimiento.start();
//   } else {
//     reconocimiento.stop();
//   }
// };

boton.onclick = () => {
  escuchando = !escuchando;

  if (escuchando) {
    reconocimiento.start();
  } else {
    reconocimiento.stop();
  }
};
