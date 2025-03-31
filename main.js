let corazonesActivos = true;
let ultimoCorazon = Date.now();
const DELAY_ENTRE_CORAZONES = 10;
const CORAZONES = [ '💘','❤️'];

// Manejo de eventos tanto para mouse como para touch
const crearCorazon = (x, y) => {
    if (!corazonesActivos) return;
    
    const ahora = Date.now();
    if (ahora - ultimoCorazon < DELAY_ENTRE_CORAZONES) return;
    ultimoCorazon = ahora;

    const heart = document.createElement('div');
    heart.className = 'floating-heart';
    heart.innerHTML = CORAZONES[Math.floor(Math.random() * CORAZONES.length)];
    
    // Posición aleatoria cerca del punto de interacción
    const offsetX = (Math.random() - 0.5) * 20;
    const offsetY = (Math.random() - 0.5) * 20;
    heart.style.left = `${x + offsetX}px`;
    heart.style.top = `${y + offsetY}px`;
    
    // Tamaño y rotación aleatorios
    const scale = 0.3 + Math.random() * 0.5;
    const rotation = Math.random() * 360;
    heart.style.transform = `scale(${scale}) rotate(${rotation}deg)`;
    
    document.body.appendChild(heart);
    setTimeout(() => {
        heart.style.opacity = '0';
        setTimeout(() => heart.remove(), 200);
    }, 1500);
};

// Evento para mouse
document.body.addEventListener('mousemove', (e) => {
    crearCorazon(e.pageX, e.pageY);
});

// Eventos para touch
document.body.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    crearCorazon(touch.pageX, touch.pageY);
    e.preventDefault();
}, { passive: false });

function abrirSobre() {
    const sobre = document.querySelector('.sobre');
    const carta = document.querySelector('.carta');
    const corazonBoton = document.querySelector('.corazon-boton');
    const lineasV = document.querySelector('.linea-v-sello');
    const estaAbierto = sobre.classList.contains('abierto');
    
    if (!estaAbierto) {
        // Ocultar las líneas rojas inmediatamente
        lineasV.style.opacity = '0';

        // Asegurarnos que la carta tenga el z-index correcto inmediatamente 
        carta.style.zIndex = '9999';
        
        // Forzar que el sobre esté por debajo
        document.querySelectorAll('.sobre-cuerpo, .sobre-frente').forEach(elem => {
            elem.style.zIndex = '1';
        });
        
        // Añadimos la clase para abrir el sobre
        sobre.classList.add('abierto');
        
        // Animación mejorada del sello
        corazonBoton.style.transform = 'translate(-50%, -50%) scale(0.8) rotate(10deg)';
        corazonBoton.style.opacity = '0';
        
        // Eliminamos estilos inline que puedan interferir con la transición
        carta.style.removeProperty('transform');
        
        // Forzar un reflow para aplicar los cambios inmediatamente
        carta.offsetHeight;
        
        setTimeout(() => {
            carta.style.visibility = 'visible';
            carta.style.opacity = '1';
            carta.style.pointerEvents = 'auto'; // Asegurar que sea clickeable
            carta.onclick = cerrarSobre;
            setTimeout(lanzarCorazones, 300);
        }, 400);
    }
}

function cerrarSobre() {
    const sobre = document.querySelector('.sobre');
    const carta = document.querySelector('.carta');
    const corazonBoton = document.querySelector('.corazon-boton');
    const lineasV = document.querySelector('.linea-v-sello');
    
    // Guardar las dimensiones actuales de la pantalla
    const anchoPantalla = window.innerWidth;
    
    // Ajustar la transformación según el tamaño de la pantalla
    if (anchoPantalla <= 480) {
        carta.style.transform = 'translate(-50%, -50%) scale(0.85)';
    } else if (anchoPantalla <= 768) {
        carta.style.transform = 'translate(-50%, -55%) scale(0.85)';
    } else {
        carta.style.transform = 'translate(-50%, -50%) scale(0.85)';
    }

    // Mostrar las líneas rojas
    setTimeout(() => {
        lineasV.style.opacity = '1';
    }, 300);
    
    carta.style.opacity = '0';
    
    setTimeout(() => {
        carta.style.visibility = 'hidden';
        sobre.classList.remove('abierto');
        carta.onclick = null;
        
        // Restaurar sello con animación
        corazonBoton.style.transform = 'translate(-50%, -50%) scale(1)';
        corazonBoton.style.opacity = '1';
    }, 600);
}

// Función para mostrar el modal de firma al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    const firmaGuardada = localStorage.getItem('firma');
    if (!firmaGuardada) {
        const modal = new bootstrap.Modal(document.getElementById('firmaModal'));
        modal.show();
    } else {
        document.querySelector('.firma-input').value = firmaGuardada;
    }
});

function guardarFirma() {
    const firmaInput = document.querySelector('.firma-input-modal');
    const firma = firmaInput.value.trim();
    
    if (firma) {
        localStorage.setItem('firma', firma);
        document.querySelector('.firma-input').value = firma;
        bootstrap.Modal.getInstance(document.getElementById('firmaModal')).hide();
        
        // Efecto de guardado
        const sobre = document.querySelector('.sobre');
        sobre.style.transform = 'scale(1.02)';
        setTimeout(() => {
            sobre.style.transform = 'scale(1)';
        }, 200);
    }
}

// Función mejorada para lanzar corazones
function lanzarCorazones() {
    const container = document.querySelector('.sobre-container');
    const rect = container.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    // Número de corazones
    const numCorazones = 20; // Aumentado para mayor efecto
    
    // Crear los corazones
    for (let i = 0; i < numCorazones; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.innerHTML = '❤️';
            
            // Ángulo con un rango más concentrado en la parte superior (-70° a 70°)
            const angulo = (Math.random() * 140 - 70) * Math.PI / 180;
            const distancia = 80 + Math.random() * 120; // 80-200px
            
            // Posición inicial (centro del sobre)
            heart.style.left = `${centerX}px`;
            heart.style.top = `${centerY}px`;
            
            // Tamaño, rotación y animación aleatorios
            const scale = 0.5 + Math.random() * 0.5;
            heart.style.transform = `scale(${scale})`;
            heart.style.opacity = '0';
            
            document.body.appendChild(heart);
            
            // Forzar un reflow para que la animación funcione
            heart.offsetHeight;
            heart.style.opacity = '0.8';
            
            // Animación con requestAnimationFrame para suavidad
            let startTime = null;
            const duracion = 1500 + Math.random() * 1000;
            
            function animateHeart(timestamp) {
                if (!startTime) startTime = timestamp;
                const progress = (timestamp - startTime) / duracion;
                
                if (progress < 1) {
                    // Trayectoria parabólica mejorada
                    const x = centerX + Math.cos(angulo) * distancia * progress;
                    // Movimiento hacia arriba con curva parabólica
                    const y = centerY - Math.sin(Math.abs(angulo)) * distancia * progress - 120 * progress * progress;
                    const currentScale = scale * (1 - progress * 0.5);
                    const rotation = progress * 360 * (Math.random() > 0.5 ? 1 : -1);
                    
                    heart.style.left = `${x}px`;
                    heart.style.top = `${y}px`;
                    heart.style.transform = `scale(${currentScale}) rotate(${rotation}deg)`;
                    
                    // Opacidad gradual
                    if (progress < 0.2) {
                        heart.style.opacity = progress * 5; // Aparición rápida
                    } else if (progress > 0.7) {
                        heart.style.opacity = (1 - progress) * 3.33; // Desaparición gradual
                    }
                    
                    requestAnimationFrame(animateHeart);
                } else {
                    heart.remove();
                }
            }
            
            requestAnimationFrame(animateHeart);
        }, i * 70); // Intervalo más rápido
    }
}