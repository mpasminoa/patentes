const canvas = document.getElementById('canvasPatente');
const ctx = canvas.getContext('2d');
let posicionActual = 'arriba';
let logoFile = null;
function actualizarValorAlto(val) {
    document.getElementById('valorAlto').innerText = val;
}

function dibujar() {
    const slider = document.getElementById('altoLogoRange');
    const altoDinamico = parseInt(slider.value);

    let rawTexto = document.getElementById('textoPatente').value.toUpperCase();
    let textoFormateado = rawTexto;

    if (rawTexto.length === 6) {
        textoFormateado = rawTexto.substring(0, 2) + "!" +
            rawTexto.substring(2, 4) + "\"" +
            rawTexto.substring(4, 6);
    }

    logoFile = document.getElementById('selectorLogo').value;

    // --- Limpiar Lienzo ---
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    const dibujarTextos = (x, y, fontSize) => {
        ctx.font = `${fontSize}px 'MiFuentePatente'`;
        ctx.fillText(textoFormateado, x, y);
        const metrica = ctx.measureText(textoFormateado);
        const anchoTexto = metrica.width;
        let xCentroRelativo = (ctx.textAlign === "left") ? x + (anchoTexto / 2) : x;

        const alineacionOriginal = ctx.textAlign;
        ctx.textAlign = "center";
        ctx.fillText("#", xCentroRelativo, y + fontSize * 1.185);
        ctx.textAlign = alineacionOriginal;
    };

    if (logoFile) {
        const img = new Image();
        img.src = `assets/logos/${logoFile}`;

        img.onload = function () {
            const proporcion = img.width / img.height;
            
            // Medimos el ancho de las letras para las restricciones
            ctx.font = "180px 'MiFuentePatente'";
            const anchoTextoPx = ctx.measureText(textoFormateado).width;
            const altoTextoPx = 161; // Tu estándar de 8mm

            if (posicionActual === 'izquierda') {
                // --- RESTRICCIÓN IZQUIERDA: No superar el alto de las letras ---
                let altoFinal = altoDinamico;
                if (altoFinal > altoTextoPx) {
                    altoFinal = altoTextoPx; // Bloqueo al alto de la patente
                }
                const anchoFinal = altoFinal * proporcion;

                const yTextoPatente = 330;
                const fontSizePatente = 180;
                const centroLetra = yTextoPatente - (fontSizePatente * 0.25);
                const yLogoCentrado = centroLetra - (altoFinal / 2);
                const xLogo = 80;

                ctx.drawImage(img, xLogo, yLogoCentrado, anchoFinal, altoFinal);

                const separacion = 40;
                const xTexto = xLogo + anchoFinal + separacion;
                ctx.textAlign = "left";
                dibujarTextos(xTexto, yTextoPatente, fontSizePatente);
                ctx.textAlign = "center";

            } else {
                // --- RESTRICCIÓN ARRIBA: No superar el ancho de las letras ---
                let anchoFinal = altoDinamico * proporcion;
                let altoFinal = altoDinamico;

                if (anchoFinal > anchoTextoPx) {
                    anchoFinal = anchoTextoPx; // Bloqueo al ancho de la patente
                    altoFinal = anchoFinal / proporcion; // Ajuste proporcional
                }

                const xCentradoLogo = (canvas.width / 2) - (anchoFinal / 2);
                const yLogoArriba = 60;
                ctx.drawImage(img, xCentradoLogo, yLogoArriba, anchoFinal, altoFinal);

                const separacionFija = 60;
                // El texto baja según el alto real que quedó el logo
                const yTextoDinamico = yLogoArriba + altoFinal + separacionFija + 120;

                ctx.textAlign = "center";
                dibujarTextos(canvas.width / 2, yTextoDinamico, 180);
            }

            // --- CÁLCULOS DE MEDIDAS PARA EL HTML ---
            const factorVidrios = 8 / 161;
            const factorEspejos = 6 / 161;

            document.getElementById('medidaLaservidrios').innerText = (anchoTextoPx * factorVidrios).toFixed(2);
            document.getElementById('medidaLaserespejos').innerText = (anchoTextoPx * factorEspejos).toFixed(2);
        };
    } else {
        dibujarTextos(canvas.width / 2, 250, 220);
    }
}

function cambiarPosicion(pos) {
    posicionActual = pos;
    dibujar();
    actualizarVisibilidadMedidas();
}

function descargarImagen() {
    const link = document.createElement('a');
    const patente = document.getElementById('textoPatente').value || 'patente';
    link.download = `grabado-${patente}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
}

document.fonts.ready.then(() => {
    cambiarPosicion('arriba');
    dibujar();
});

function actualizarVisibilidadMedidas() {
    const divArriba = document.getElementById('info-logo-arriba');
    const divIzquierda = document.getElementById('info-logo-izquierda');

    if (posicionActual === 'arriba' && logoFile != "") {
        divArriba.classList.remove('hidden');
        divIzquierda.classList.add('hidden');
    } else {
        divArriba.classList.add('hidden');
        divIzquierda.classList.remove('hidden');
    }
}

document.getElementById('selectorLogo').addEventListener('change', () => {
    // 1. Actualizamos qué tabla de medidas se ve
    actualizarVisibilidadMedidas();

    // 2. Redibujamos el canvas para cargar (o quitar) el logo
    dibujar();
});
