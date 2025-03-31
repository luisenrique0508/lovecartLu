let corazonesActivos = true;
let ultimoCorazon = Date.now();
const DELAY_ENTRE_CORAZONES = 15;
const CORAZONES = [ '❤️'];

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
    const estaAbierto = sobre.classList.contains('abierto');
    
    if (!estaAbierto) {
        sobre.classList.add('abierto');
        
        // Animación mejorada del sello
        corazonBoton.style.transform = 'translate(-50%, -50%) scale(0.8) rotate(10deg)';
        corazonBoton.style.opacity = '0';
        
        setTimeout(() => {
            carta.style.visibility = 'visible';
            carta.style.opacity = '1';
            carta.onclick = cerrarSobre;
            setTimeout(lanzarCorazones, 300);
        }, 400);
    }
}

function cerrarSobre() {
    const sobre = document.querySelector('.sobre');
    const carta = document.querySelector('.carta');
    const corazonBoton = document.querySelector('.corazon-boton');
    
    carta.style.transform = 'translate(-50%, -50%)';
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

// Mejorar la animación de los corazones
function lanzarCorazones() {
    const sobre = document.querySelector('.sobre');
    const rect = sobre.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const angle = (i / 20) * Math.PI * 2;
            const distance = 100;
            const x = centerX + Math.cos(angle) * distance;
            const y = centerY + Math.sin(angle) * distance;
            crearCorazon(x, y);
        }, i * 50);
    }
}