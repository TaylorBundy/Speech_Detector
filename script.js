const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const reconocimiento = new SpeechRecognition();

reconocimiento.continuous = true;
reconocimiento.interimResults = false;

// escucha directamente portugués BR
reconocimiento.lang = "pt-BR";

const estado = document.getElementById("estado");
const idioma = document.getElementById("idioma");
const original = document.getElementById("original");
const traducido = document.getElementById("traducido");

// document.getElementById("iniciar").onclick = () => {
//   reconocimiento.start();
// };

// document.getElementById("detener").onclick = () => {
//   reconocimiento.stop();
// };

// reconocimiento.onstart = () => {
//   estado.innerHTML = "🟢 Escuchando...";
// };
reconocimiento.onstart = () => {
  microfonoActivo = true;

  estado.innerHTML = "🟢 Escuchando...";

  estadoMic.innerHTML = "🟢 Micrófono activado";
  estadoMic.className = "encendido";

  boton.innerHTML = "⛔ Desactivar micrófono";
};

// reconocimiento.onend = () => {
//   estado.innerHTML = "🔴 Detenido";
// };
reconocimiento.onend = () => {
  microfonoActivo = false;

  estado.innerHTML = "🔴 Detenido";

  estadoMic.innerHTML = "🔴 Micrófono desactivado";
  estadoMic.className = "apagado";

  boton.innerHTML = "🎤 Activar micrófono";
};

reconocimiento.onresult = async (e) => {
  let texto = e.results[e.results.length - 1][0].transcript;

  original.innerHTML = texto;

  idioma.innerHTML = "Portugués (Brasil)";

  traducir(texto);
};

async function traducir(texto) {
  const respuesta = await fetch("https://libretranslate.com/translate", {
    method: "POST",

    headers: {
      "Content-Type": "application/json",
    },

    body: JSON.stringify({
      q: texto,
      source: "pt",
      target: "es",
      format: "text",
    }),
  });

  const datos = await respuesta.json();

  traducido.innerHTML = datos.translatedText;
}

let microfonoActivo = false;

const boton = document.getElementById("toggleMic");
const estadoMic = document.getElementById("microfonoEstado");

boton.onclick = () => {
  if (!microfonoActivo) {
    reconocimiento.start();
  } else {
    reconocimiento.stop();
  }
};
