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
        ctx.font = `${fontSize}px 'MiFuentePatente'`;
        ctx.fillText(textoFormateado, x, y);
        // El salto de línea que necesitabas para el tamaño exacto
        ctx.fillText("#", x, y + fontSize * 1.185);
    };

    if (logoFile) {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = `assets/logos/${logoFile}`;
        
        img.onload = function() {
            const alturaFija = 220;
            const proporcion = img.width / img.height;
            const anchoAutomatico = alturaFija * proporcion;

            if (posicionActual === 'izquierda') {
                // Logo a la izquierda
                ctx.drawImage(img, 50, 150, anchoAutomatico, alturaFija);
                // El texto se mueve dinámicamente según el ancho del logo para no solaparse
                const xTexto = 50 + anchoAutomatico + 350; 
                dibujarTextos(xTexto, 300, 180);
            } else {
                // --- CENTRADO PERFECTO ARRIBA ---
                // Calculamos el centro del canvas menos la mitad del ancho del logo
                const xCentradoLogo = (canvas.width / 2) - (anchoAutomatico / 2);
                ctx.drawImage(img, xCentradoLogo, 50, anchoAutomatico, alturaFija);
                dibujarTextos(canvas.width / 2, 450, 180);
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