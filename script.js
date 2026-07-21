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
const palabraDetenerFinal = "terminar";
let activo = true;
let temporizador = null;
const radios = document.querySelector(".radio");
const radioEspañol = document.querySelector("#Español");
const radioPortugues = document.querySelector("#Portugues");
const btn = document.querySelector(".btnPlay");
const playButton = document.querySelector(".play-button");
let temporal = false;
let frase = "";
let textoCompleto = "";

document.addEventListener("DOMContentLoaded", () => {
  radioEspañol.title = "Selecciona para escuchar en español.";
  radioPortugues.title = "Selecciona para escuchar en portugués.";
  if (traducido.textContent === "") {
    playButton.style.display = "none";
  }
  if (estado.textContent === "Esperando...") {
    estado.innerHTML = `<img class="imgEscucha" src="Images/esperando.avif">Esperando...`;
  }
  temporizador = setTimeout(() => {
    if (radioPortugues.checked) {
      reconocimiento.lang = "pt-BR";
    } else {
      radioPortugues.checked = true;
    }
    if (radioEspañol.checked) {
      reconocimiento.lang = "es-ES";
    }
    if (radioEspañol.checked || radioPortugues.checked) {
      activo = true;
      iniciarMicrofono();
    }
    setTimeout(() => {
      if (activo === true) {
        detenerMicrofonoCompleto();
      }
    }, 900000);
  }, 5000);
});

// setTimeout(() => {
//   if (activo === true) {
//     detenerMicrofonoCompleto();
//   }
// }, 25000);

const SpeechRecognition =
  window.SpeechRecognition || window.webkitSpeechRecognition;

const reconocimiento = new SpeechRecognition();

reconocimiento.continuous = true;
// reconocimiento.interimResults = false;
reconocimiento.interimResults = true;

// escucha directamente portugués BR
// if (radioPortugues.checked) {
//   reconocimiento.lang = "pt-BR";
// }
// if (radioEspañol.checked) {
//   reconocimiento.lang = "es-ES";
// }

reconocimiento.onstart = () => {
  microfonoActivo = true;

  estado.innerHTML = `<img class="imgEscucha" src="Images/escucha.avif">🟢 Escuchando...`;
  estado.title = "El micrófono esta activo y escuchando.";

  estadoMic.innerHTML = "🟢 Micrófono activado";
  estadoMic.className = "encendido";

  boton.innerHTML = "⛔ Desactivar micrófono";
  boton.title = "El micrófono esta activo y escuchando. Puede desactivarlo.";
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

  estado.innerHTML = `<img class="imgEscucha" src="Images/noescucha.avif">🔴 Detenido`;

  estadoMic.innerHTML = "🔴 Micrófono desactivado";
  estadoMic.className = "apagado";

  boton.innerHTML = "🎤 Activar micrófono";
  boton.title = "El micrófono esta desactivado. Puede activarlo nuevamente.";
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

//let texto = "";
// reconocimiento.onresult = async (e) => {
//   let resultado = e.results[e.results.length - 1];

//   console.log("Resultado:", resultado);

//   texto = resultado[0].transcript.toLowerCase().trim();
//   //texto += " " + resultado[0].transcript.toLowerCase().trim();
//   if (activo) {
//     if (texto.includes(palabraDetener)) {
//       if (playButton.style.display === "flex") {
//         playButton.style.display = "none";
//       }
//       detenerMicrofono();
//       return;
//     } else if (texto.includes(palabraDetenerFinal)) {
//       if (playButton.style.display === "flex") {
//         playButton.style.display = "none";
//       }
//       detenerMicrofonoCompleto();
//       return;
//     }
//   } else {
//     if (texto.includes(palabraActivacion)) {
//       activo = true;
//       //console.log("Activado nuevamente");
//     }
//   }
//   const idioma2 = await detectarIdioma(texto);
//   if (idioma2 !== "PT") {
//     //console.log("Idioma detectado:", idioma2);
//     idioma.textContent = `Idioma detectado: ${idioma2}`;
//     original.textContent = texto;
//     traducido.textContent = "No se traducirá porque no es portugués.";
//     if (traducido.textContent === "No se traducirá porque no es portugués.") {
//       if (playButton.style.display === "flex") {
//         playButton.style.display = "none";
//       }
//     }

//     return; // No traducir si no es portugués
//   } else {
//     //console.log("Idioma detectado:", idioma2);
//     //frase += " " + resultado[0].transcript;
//     //console.log(frase);
//     original.textContent = texto;
//     //clearTimeout(temporizador);

//     // Solo traducir cuando la frase terminó
//     if (!resultado.isFinal) return;

//     idioma.textContent = "Portugués (Brasil)";
//     // temporizador = setTimeout(async () => {
//     //   const textoFinal = texto.trim();

//     //   texto = "";

//     //   console.log("Traduciendo:", textoFinal);

//     //   traducir(textoFinal);
//     // }, 5000);

//     traducir(texto);
//   }
// };

// reconocimiento.onresult = (event) => {
//   for (let i = event.resultIndex; i < event.results.length; i++) {
//     textoCompleto += event.results[i][0].transcript + " ";
//   }

//   clearTimeout(temporizador);

//   temporizador = setTimeout(async () => {
//     const frase = textoCompleto.trim();

//     console.log(frase);

//     textoCompleto = "";

//     // await traducir(frase);
//   }, 5000);
// };

// reconocimiento.onresult = (event) => {
//   // Reconstruye toda la frase reconocida
//   textoCompleto = "";
//   idioma.textContent = "";
//   original.textContent = "";

//   for (let i = 0; i < event.results.length; i++) {
//     textoCompleto += event.results[i][0].transcript + " ";
//   }

//   textoCompleto = textoCompleto.trim();

//   console.clear();
//   console.log("Reconociendo...");
//   console.log(textoCompleto);
//   original.textContent = textoCompleto;

//   if (activo) {
//     if (textoCompleto.includes(palabraDetener)) {
//       textoCompleto = "";
//       if (playButton.style.display === "flex") {
//         playButton.style.display = "none";
//       }
//       detenerMicrofono();
//       return;
//     } else if (textoCompleto.includes(palabraDetenerFinal)) {
//       textoCompleto = "";
//       if (playButton.style.display === "flex") {
//         playButton.style.display = "none";
//       }
//       detenerMicrofonoCompleto();
//       return;
//     }
//   } else {
//     if (textoCompleto.includes(palabraActivacion)) {
//       activo = true;
//       //console.log("Activado nuevamente");
//     }
//   }
//   (async () => {
//     const idioma2 = await detectarIdioma(textoCompleto);
//     if (idioma2 !== "PT") {
//       console.log("Idioma detectado:", idioma2);
//       idioma.textContent = `Idioma detectado: ${idioma2}`;
//       original.textContent = textoCompleto;
//       traducido.textContent = "No se traducirá porque no es portugués.";
//       if (traducido.textContent === "No se traducirá porque no es portugués.") {
//         if (playButton.style.display === "flex") {
//           playButton.style.display = "none";
//         }
//       }

//       return; // No traducir si no es portugués
//     } else {
//       idioma.textContent = "Portugués (Brasil)";
//       //await traducir(textoCompleto);
//       //textoCompleto = "";
//     }
//   })();

//   // Reinicia el contador de silencio
//   clearTimeout(temporizador);

//   temporizador = setTimeout(async () => {
//     console.log("✅ Frase finalizada");
//     console.log(textoCompleto);
//     await traducir(textoCompleto);

//     // Aquí puedes traducir
//     // await traducir(textoCompleto);

//     // Limpia la frase para comenzar una nueva
//     textoCompleto = "";
//   }, 5000);
// };

reconocimiento.onresult = (event) => {
  textoCompleto = "";
  // Agregar únicamente los resultados nuevos
  for (let i = event.resultIndex; i < event.results.length; i++) {
    textoCompleto += event.results[i][0].transcript + " ";
  }

  textoCompleto = textoCompleto.trim();

  original.textContent = textoCompleto;
  if (original.textContent.includes(palabraDetener.toLowerCase())) {
    if (playButton.style.display === "flex") playButton.style.display = "none";
    detenerMicrofono();
    return;
  }
  if (original.textContent.includes(palabraDetenerFinal.toLowerCase())) {
    if (playButton.style.display === "flex") playButton.style.display = "none";

    detenerMicrofonoCompleto();
    return;
  }

  // Reiniciar temporizador de silencio
  clearTimeout(temporizador);

  temporizador = setTimeout(async () => {
    frase = textoCompleto.trim();

    if (!frase) return;

    console.clear();
    console.log("Frase completa:", frase);

    // Limpiar para comenzar una nueva frase
    textoCompleto = "";

    // ==========================
    // PALABRAS DE CONTROL
    // ==========================

    if (activo) {
      if (frase.toLowerCase().includes(palabraDetener.toLowerCase())) {
        if (playButton.style.display === "flex")
          playButton.style.display = "none";

        detenerMicrofono();
        return;
      }

      if (frase.toLowerCase().includes(palabraDetenerFinal.toLowerCase())) {
        if (playButton.style.display === "flex")
          playButton.style.display = "none";

        detenerMicrofonoCompleto();
        return;
      }
    } else {
      if (frase.toLowerCase().includes(palabraActivacion.toLowerCase())) {
        activo = true;
        console.log("Micrófono activado nuevamente.");
      }

      return;
    }

    // ==========================
    // DETECTAR IDIOMA
    // ==========================

    idioma.textContent = "Detectando idioma...";

    const idiomaDetectado = await detectarIdioma(frase);

    console.log("Idioma:", idiomaDetectado);

    if (idiomaDetectado !== "PT") {
      idioma.textContent = idiomaDetectado;
      original.textContent = frase;
      traducido.textContent = "No se traducirá porque no es portugués.";

      if (playButton.style.display === "flex")
        playButton.style.display = "none";

      return;
    }

    // ==========================
    // TRADUCIR
    // ==========================

    idioma.textContent = "Portugués (Brasil)";
    //original.textContent = frase;
    const eltextofinal = original.textContent;
    console.log(eltextofinal);

    //await traducir(frase);
    await traducir(eltextofinal);
    //textoCompleto = "";
  }, 5000);
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
    //console.log("Datos recibidos:", datos);
    //console.log(datos.idioma, datos.traducido);

    if (datos.error) {
      throw new Error(datos.error);
    }

    traducido.textContent = datos.traducido;
    if (
      !traducido.textContent == "No se traducirá porque no es portugués." ||
      traducido.textContent == datos.traducido
    ) {
      playButton.style.display = "flex";
      setTimeout(() => {
        btn.click();
      }, 2000);
    }
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
  //console.log("Idioma detectado:", datos.idioma);
  //console.log(datos);

  return datos.idioma;
}

function iniciarMicrofono() {
  try {
    reconocimiento.start();
    //console.log("Micrófono iniciado");
  } catch (e) {}
}

function detenerMicrofono() {
  activo = false;
  reconocimiento.stop();
  if (temporal === true) return;
  idioma.textContent = "";
  original.textContent = "";
  traducido.textContent = "";
  //console.log("Micrófono detenido");
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
  //console.log("Micrófono detenido completo");
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

async function leerTexto() {
  // Obtener el texto del área de texto
  try {
    //const texto = document.querySelector('#descr');
    const texto = traducido.textContent.trim(); //document.querySelector('#traducido')?.textContent.trim();
    //const btn = document.querySelector('.btnPlay');
    //if (btn.classList == 'btnPlay') {
    if (btn.className === "btnPlay") {
      btn.classList.add("stop");
      if (texto !== "") {
        const utterance = new SpeechSynthesisUtterance(texto);
        // Opcional: configurar el idioma y la voz
        utterance.lang = "es-ES"; // Español
        utterance.volume = 1; // 0 a 1 (Volumen)
        utterance.rate = 1; // Velocidad de habla
        utterance.pitch = 2; // Tono

        // Cuando comienza a hablar
        utterance.onstart = () => {
          temporal = true;
          detenerMicrofono();
          console.log("🔴 Micrófono detenido");
        };

        // Configurar el evento onend para detectar cuando termine la lectura
        utterance.onend = function (event) {
          btn.classList.remove("stop");
          temporal = false;
          activo = true;
          iniciarMicrofono();
        };

        // Iniciar la lectura
        speechSynthesis.speak(utterance);
        // temporal = true;
        // detenerMicrofono();
      }
    } else if (btn.className === "btnPlay stop") {
      btn.classList.remove("stop");
      if (speechSynthesis.speaking) {
        speechSynthesis.cancel();
      }
    }
  } catch (error) {
    console.error("Error al leer el texto: ", error);
  }
}
