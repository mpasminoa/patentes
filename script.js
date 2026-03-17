const canvas = document.getElementById('canvasPatente');
const ctx = canvas.getContext('2d');
let posicionActual = 'arriba';

function dibujar() {
    let rawTexto = document.getElementById('textoPatente').value.toUpperCase();
    let textoFormateado = rawTexto;

    if (rawTexto.length === 6) {
        textoFormateado = rawTexto.substring(0, 2) + "!" +
            rawTexto.substring(2, 4) + "\"" +
            rawTexto.substring(4, 6);
    }

    const logoFile = document.getElementById('selectorLogo').value;

    // --- Limpiar Lienzo ---
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.textAlign = "center";

    const dibujarTextos = (x, y, fontSize) => {
        // 1. Dibujamos la patente
        ctx.font = `${fontSize}px 'MiFuentePatente'`;
        ctx.fillText(textoFormateado, x, y);

        // 2. Calculamos el centro real del bloque de texto
        const metrica = ctx.measureText(textoFormateado);
        const anchoTexto = metrica.width;
        let xCentroRelativo;

        if (ctx.textAlign === "left") {
            // Si el texto nace a la izquierda, el centro es: inicio + (ancho / 2)
            xCentroRelativo = x + (anchoTexto / 2);
        } else {
            // Si ya está centrado, el centro es simplemente x
            xCentroRelativo = x;
        }

        // 3. Dibujamos el "#" justo bajo ese centro calculado
        const alineacionOriginal = ctx.textAlign;
        ctx.textAlign = "center";
        ctx.fillText("#", xCentroRelativo, y + fontSize * 1.185);
        ctx.textAlign = alineacionOriginal;
    };
    if (logoFile) {
        const img = new Image();
      //   img.crossOrigin = "anonymous";
        img.src = `assets/logos/${logoFile}`;


        img.onload = function () {
            const alturaFijaArriba = 220;
            const alturaFijaIzquierda = 170;
            const proporcion = img.width / img.height;

            // Cálculo para centrar verticalmente: (Alto Canvas / 2) - (Alto Logo / 2)
            const yCentro = (canvas.height / 2) - (alturaFijaIzquierda / 2);

            if (posicionActual === 'izquierda') {
                const anchoAutomatico = alturaFijaIzquierda * proporcion;

                // 1. DEFINIMOS LA ALTURA DEL TEXTO
                // (Esta es la línea base donde se apoyan las letras)
                const yTextoPatente = 330;
                const fontSizePatente = 180;

                // 2. CENTRADO VERTICAL REAL CON LAS LETRAS
                // El "centro" visual de una fuente suele estar un poco arriba de su base.
                // Usamos - (fontSize * 0.35) para encontrar el medio de la letra
                // y luego - (alturaLogo / 2) para que el logo calce justo ahí.
                const centroLetra = yTextoPatente - (fontSizePatente * 0.25);
                const yLogoCentrado = centroLetra - (alturaFijaIzquierda / 2);

                const xLogo = 80;
                ctx.drawImage(img, xLogo, yLogoCentrado, anchoAutomatico, alturaFijaIzquierda);

                // 3. POSICIÓN X DEL TEXTO (Al lado del logo)
                const separacion = 40;
                const xTexto = xLogo + anchoAutomatico + separacion;

                ctx.textAlign = "left";
                dibujarTextos(xTexto, yTextoPatente, fontSizePatente);

                // Regresamos a center para no romper otros dibujos
                ctx.textAlign = "center";

            } else {
                // 1. ACHICAMOS LA DISTANCIA
                const anchoAutomatico = alturaFijaArriba * proporcion;
                const xCentradoLogo = (canvas.width / 2) - (anchoAutomatico / 2);

                // Bajamos el logo un poco (de 40 a 80 para que no esté pegado al borde superior)
                const yLogoArriba = 50;
                ctx.drawImage(img, xCentradoLogo, yLogoArriba, anchoAutomatico, alturaFijaArriba);

                // 2. ACERCAMOS EL TEXTO AL LOGO
                // Subimos la patente de 480 a 420 para cerrar el espacio
                ctx.textAlign = "center";
                dibujarTextos(canvas.width / 2, 420, 180);
            }
        };

    } else {
        dibujarTextos(canvas.width / 2, 250, 220);
    }
}

function cambiarPosicion(pos) {
    posicionActual = pos;
    dibujar();
}

function descargarImagen() {
    const link = document.createElement('a');
    const patente = document.getElementById('textoPatente').value || 'patente';
    link.download = `grabado-${patente}.jpg`;
    link.href = canvas.toDataURL("image/jpeg", 1.0);
    link.click();
}

document.fonts.ready.then(() => {
    dibujar();
});