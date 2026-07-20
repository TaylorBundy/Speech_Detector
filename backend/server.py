from flask import Flask, request, jsonify
from flask_cors import CORS
import requests
import os
from langdetect import detect

# ===========================================
# CONFIGURACIÓN
# ===========================================

DEEPL_API_KEY = os.environ.get("API_KEY")
#DEEPL_API_KEY = "8aa6a2b5-9057-4a5e-ba23-63e3d1a4fa05:fx"

DEEPL_URL = "https://api-free.deepl.com/v2/translate"

# ===========================================
# FLASK
# ===========================================

app = Flask(__name__)
CORS(app)

# ===========================================
# RUTAS
# ===========================================

@app.route("/")
def inicio():
    return "Servidor de traducción DeepL funcionando."

@app.route("/traducir", methods=["POST"])
def traducir():

    try:

        datos = request.get_json()

        if not datos:
            return jsonify({
                "error": "No se recibieron datos."
            }), 400

        texto = datos.get("texto", "").strip()
        idioma = detect(texto)

        if texto == "":
            return jsonify({
                "error": "Texto vacío."
            }), 400

        respuesta = requests.post(
            DEEPL_URL,
            headers={
                "Authorization": f"DeepL-Auth-Key {DEEPL_API_KEY}"
            },
            data={
                "text": texto,
                "target_lang": "ES"
            },
            timeout=15
        )

        if respuesta.status_code != 200:

            return jsonify({
                "error": "Error de DeepL",
                "detalle": respuesta.text
            }), respuesta.status_code

        datos_traducidos = respuesta.json()
        traduccion = datos_traducidos["translations"][0]
        if idioma != "pt":
            return jsonify({
                "idioma": idioma,
                "traducido": None
            })

        return jsonify({
            "original": texto,
            "traducido": datos_traducidos["translations"][0]["text"]
        })
        return jsonify({
            "idioma": traduccion["detected_source_language"],
            "traducido": traduccion["text"]
        })

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500

# ===========================================
# MAIN
# ===========================================

if __name__ == "__main__":

    app.run(
        host="0.0.0.0",
        port=5000,
        debug=True
    )