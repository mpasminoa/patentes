const canvas = document.getElementById('canvasPatente');
const ctx = canvas.getContext('2d');
let posicionActual = 'arriba';

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

            const alturaFijaArriba = altoDinamico + 50;
            const alturaFijaIzquierda = altoDinamico;
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
                // 1. CALCULAMOS EL ANCHO Y ALTO DINÁMICO
                const anchoAutomatico = altoDinamico * proporcion;
                const xCentradoLogo = (canvas.width / 2) - (anchoAutomatico / 2);

                // Posición inicial del logo (un poco de margen desde el borde superior)
                const yLogoArriba = 60;
                ctx.drawImage(img, xCentradoLogo, yLogoArriba, anchoAutomatico, altoDinamico);

                // 2. LA MAGIA: POSICIÓN DINÁMICA DEL TEXTO
                // Definimos una separación fija (ej: 60px) entre el fin del logo y el inicio de las letras
                const separacionFija = 60;

                // El texto se dibujará en: (Inicio Logo + Su Altura + Separación + Ajuste de Fuente)
                // El ajuste de +120 es para que la "línea base" del texto considere el alto de la letra
                const yTextoDinamico = yLogoArriba + altoDinamico + separacionFija + 120;

                ctx.textAlign = "center";
                dibujarTextos(canvas.width / 2, yTextoDinamico, 180);
            }


            // --- CÁLCULO DE MEDIDA PARA EL LÁSER (REGLA FIJA FIEL AL DIBUJO) ---
            /*let medidaFinalMM;
            
            if (logoFile) {
                // Definimos qué altura estamos usando realmente para dibujar
                let alturaRealUtilizada;
                
                if (posicionActual === 'izquierda') {
                    alturaRealUtilizada = altoDinamico; // Aquí usas el valor del slider tal cual
                } else {
                    alturaRealUtilizada = altoDinamico + 50; // Aquí es donde le sumas los 50 por defecto
                }
            
                // REGLA DE TRES: Si 220px (170+50) son 24mm, la relación es 24/220
                medidaFinalMM = (alturaRealUtilizada * 24) / 220;
            } else {
                // Sin logo, tu medida estándar
                medidaFinalMM = 11.82;
            }
            
            // Actualizamos el número en el HTML
            const displayMedida = document.getElementById('medidaLaser');
            if (displayMedida) {
                displayMedida.innerText = medidaFinalMM.toFixed(2);
            }
            */
            // --- CÁLCULO DE PRECISIÓN ABSOLUTA (161px = 8mm) ---
   // --- CÁLCULO DE MEDIDA (MODO ARRIBA) ---
// 1. Datos base en píxeles (Tinta real)
const PIXELES_LETRA_TINTA = 161; 
const SEPARACION_PX = 60;
const MM_LETRA_OBJETIVO = 8;

// 2. Altura del logo con tu ajuste de +50
const altoLogoRealPx = altoDinamico + 50;

// 3. Altura Total de Tinta (Lo que el láser detecta)
// Logo + Espacio + Letras
const alturaTotalTintaPx = altoLogoRealPx + SEPARACION_PX + PIXELES_LETRA_TINTA;

// 4. Cálculo final: (Altura Total / 161) * 8
const medidaFinalMM = (alturaTotalTintaPx / PIXELES_LETRA_TINTA) * MM_LETRA_OBJETIVO;

// 5. Actualizar solo el elemento de texto en el HTML
const displayMedida = document.getElementById('medidaLaser');
if (displayMedida) {
    displayMedida.innerText = medidaFinalMM.toFixed(2);
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