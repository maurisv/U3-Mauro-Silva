const shapes = document.querySelectorAll(".shape");
const logo = document.querySelector(".logo");

let mouseX = 0;
let mouseY = 0;

const config = [];
const centerX = window.innerWidth / 2;
const centerY = window.innerHeight / 2 - 50;

/* DESPLAZAMIENTOS HACIA EL CENTRO */
const centerOffsets = [
    { x: 120, y: 80 },    // c1
    { x: 80, y: -60 },    // c2
    { x: -120, y: 60 },   // c3
    { x: 60, y: 100 },    // t1
    { x: 80, y: -80 },    // t2
    { x: -100, y: 40 },   // t3
    { x: 100, y: 60 },    // s1
    { x: -80, y: 80 },    // s2
    { x: 0, y: -60 },     // s3
    { x: 120, y: -40 },   // r1
    { x: 40, y: 80 },     // r2
    { x: -100, y: -60 },  // r3
    { x: 80, y: 20 },     // b2
    { x: -80, y: 20 },    // b3
    { x: -60, y: 60 },    // a1
    { x: 80, y: 0 },      // a2
    { x: -60, y: -60 }    // a3
];

shapes.forEach((shape, index) => {
    config.push({
        rotation: Math.random() * 360,
        floatSpeed: 0.5 + Math.random(),
        floatAmount: 10 + Math.random() * 20,
        fallSpeed: 0.5 + Math.random() * 2
    });
});

/* PARALLAX */
document.addEventListener("mousemove", (e) => {
    mouseX = (e.clientX - window.innerWidth / 2) * 0.02;
    mouseY = (e.clientY - window.innerHeight / 2) * 0.02;
});

/* ANIMACIÓN */
function animate() {
    const time = Date.now() * 0.001;
    const progress = Math.min(window.scrollY / window.innerHeight, 1);

    shapes.forEach((shape, index) => {
        const data = config[index];
        const floatX = Math.sin(time * data.floatSpeed + index) * data.floatAmount;
        const floatY = Math.cos(time * data.floatSpeed + index) * data.floatAmount;
        const moveX = 0;
        const moveY = progress * window.innerHeight * data.fallSpeed;

        shape.style.transform = `
            translate(
                ${mouseX + floatX + moveX}px,
                ${mouseY + floatY + moveY}px
            )
            rotate(${data.rotation}deg)
        `;
    });

    if (logo) {
        logo.style.opacity = 1 - progress;
    }

    requestAnimationFrame(animate);
}

const messages = [
    "¡Construye, junta y gana!",
    "Haz click en cualquier figura para comenzar"
];

const subtitle = document.getElementById("dynamicSubtitle");
let current = 0;

function changeSubtitle() {
    if (!subtitle) return;
    subtitle.style.opacity = "0";
    setTimeout(() => {
        current = (current + 1) % messages.length;
        subtitle.textContent = messages[current];
        subtitle.style.opacity = "1";
    }, 600);
}

setInterval(changeSubtitle, 5000);
animate();

/* ===================================== */
/* SECCIÓN FIGURAS CAYENDO */
/* ===================================== */
const fallingShapes = document.querySelectorAll(".fall-shape");
let viewportWidth = window.innerWidth;
let viewportHeight = window.innerHeight;
const fallingData = [];
let activeFigure = null;

fallingShapes.forEach((shape) => {
    const data = {
        element: shape,
        x: Math.random() * (viewportWidth - 200),
        y: Math.random() * -viewportHeight,
        speed: 1 + Math.random() * 2,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 0.25,
        paused: false,
        dragging: false
    };

    shape.addEventListener("mouseenter", () => {
        if (!data.dragging) data.paused = true;
    });

    shape.addEventListener("mouseleave", () => {
        if (!data.dragging) data.paused = false;
    });

    shape.addEventListener("click", (e) => {
        e.stopPropagation();
        if (activeFigure === data) {
            data.dragging = false;
            data.paused = false;
            shape.style.zIndex = "1";
            activeFigure = null;
            return;
        }
        if (activeFigure) {
            activeFigure.dragging = false;
            activeFigure.paused = false;
            activeFigure.element.style.zIndex = "1";
        }
        activeFigure = data;
        data.dragging = true;
        data.paused = true;
        shape.style.zIndex = "100";
    });

    fallingData.push(data);
});

document.addEventListener("mousemove", (e) => {
    if (!activeFigure) return;
    const rect = activeFigure.element.getBoundingClientRect();
    activeFigure.x = e.clientX - rect.width / 2;
    activeFigure.y = e.clientY - rect.height / 2;
});

document.addEventListener("click", (e) => {
    if (!activeFigure) return;
    if (e.target.classList.contains("fall-shape")) return;
    activeFigure.dragging = false;
    activeFigure.paused = false;
    activeFigure.element.style.zIndex = "1";
    activeFigure = null;
});

function animateFalling() {
    fallingData.forEach((data) => {
        if (!data.paused && !data.dragging) {
            data.y += data.speed;
            data.rotation += data.rotationSpeed;
        }
        if (data.y > viewportHeight + 250) {
            data.y = -250;
            data.x = Math.random() * (viewportWidth - 200);
            data.speed = 1 + Math.random() * 2;
        }
        data.element.style.transform = `
            translate(${data.x}px, ${data.y}px)
            rotate(${data.rotation}deg)
        `;
    });
    requestAnimationFrame(animateFalling);
}
animateFalling();

window.addEventListener("resize", () => {
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    fallingData.forEach((data) => {
        if (data.x > viewportWidth - 100) {
            data.x = viewportWidth - 100;
        }
    });
});

const heroShapes = document.querySelectorAll(".hero .shape");
const targetSection = document.querySelector("#crea-construye");

heroShapes.forEach((shape) => {
    shape.addEventListener("click", () => {
        shape.style.transition = "transform 0.6s ease";
        shape.style.transform += " translateY(300px)";
        setTimeout(() => {
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        }, 500);
    });
});

/* ===================================== */
/* SECCIÓN CARTAS */
/* ===================================== */
const cards = document.querySelectorAll(".card");
const leftBtn = document.querySelector(".card-arrow.left");
const rightBtn = document.querySelector(".card-arrow.right");
const cardTitle = document.getElementById("cardTitle");
const cardDescription = document.getElementById("cardDescription");

const cardData = [
    { title: "JUEGO", description: "Contienen dos temáticas, el vocero es quien debe elegir el concepto para la partida. Todos construyen menos él." },
    { title: "FORMA", description: "Te permitiran conseguir la victoria. Puedes obtenerlas en el mazo especial, o a través de cartas de beneficio." },
    { title: "BENEFICIO", description: "¡Qué suerte! Con ellas podrás conseguir fichas, cartas y otras ayudas para ganar la partida." },
    { title: "NEGATIVA", description: "Entorpeceran tu progreso en la partida, pueden hacerte perder fichas o cartas Forma. ¡Ten cuidado!" }
];

let currentCard = 0;

function updateCards() {
    cards.forEach((card, index) => {
        card.classList.remove("center", "left", "right", "back");
        const total = cards.length;
        let position = (index - currentCard + total) % total;

        if (position === 0) card.classList.add("center");
        else if (position === 1) card.classList.add("right");
        else if (position === total - 1) card.classList.add("left");
        else card.classList.add("back");
    });

    if (cardTitle && cardDescription) {
        cardTitle.classList.add("fade");
        cardDescription.classList.add("fade");
        setTimeout(() => {
            cardTitle.textContent = cardData[currentCard].title;
            cardDescription.textContent = cardData[currentCard].description;
            cardTitle.classList.remove("fade");
            cardDescription.classList.remove("fade");
        }, 300);
    }
}

if (rightBtn) {
    rightBtn.addEventListener("click", () => {
        currentCard = (currentCard + 1) % cards.length;
        updateCards();
    });
}

if (leftBtn) {
    leftBtn.addEventListener("click", () => {
        currentCard = (currentCard - 1 + cards.length) % cards.length;
        updateCards();
    });
}
updateCards();

/* ===================================== */
/* INTERSECTION OBSERVER: TIEMPO */
/* ===================================== */
const tiempoContent = document.querySelector(".tiempo-content");
if (tiempoContent) {
    const observerTiempo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                tiempoContent.classList.add("visible");
            }
        });
    }, { threshold: 0.3 });
    observerTiempo.observe(tiempoContent);
}


/* ===================================== */
/* EVENTO SCROLL: RELOJ (¡YA CERRADO!)   */
/* ===================================== */

const reloj = document.querySelector(".reloj-img");
const tiempoSection = document.querySelector(".tiempo-content");

window.addEventListener("scroll", () => {
    if (!tiempoSection || !reloj) return;
    const rect = tiempoSection.getBoundingClientRect();
    
    const start = window.innerHeight * 2;
    const end = window.innerHeight * 0.3;

    let progress = (start - rect.top) / (start - end);
    progress = Math.max(0, Math.min(progress, 1));

    const translateY = 300 - (300 * progress);
    const scale = 0.5 + (0.8 * progress);

    reloj.style.opacity = progress;
    reloj.style.transform = `
        translateY(${translateY}px)
        rotate(8deg)
        scale(${scale})
    `;
}); // <-- AQUÍ SE CIERRA CORRECTAMENTE EL EVENTO DE SCROLL DEL RELOJ

/* ======================================================= */
/* CONTROL DE LA GALERÍA DE FOTOS (MOVIMIENTO CONTINUO DER) */
/* ======================================================= */
const photos = document.querySelectorAll(".gallery-photo");
let absolutePhotoIdx = 0; 

function updateGalleryPhotos() {
    const totalPhotos = photos.length;
    if (totalPhotos === 0) return;

    const currentPhotoIdx = ((absolutePhotoIdx % totalPhotos) + totalPhotos) % totalPhotos;

    photos.forEach((photo, index) => {
        photo.classList.remove("active-center", "active-left", "active-right", "hidden-back");

        let position = (index - currentPhotoIdx + totalPhotos) % totalPhotos;

        if (position === 0) {
            photo.classList.add("active-center");
        } else if (position === 1) {
            photo.classList.add("active-right");
        } else if (position === totalPhotos - 1) {
            photo.classList.add("active-left");
        } else {
            photo.classList.add("hidden-back");
        }
    });
}

// Cambiar de forma limpia cada 4 segundos de forma independiente
setInterval(() => {
    if (photos.length > 0) {
        absolutePhotoIdx++; 
        updateGalleryPhotos();
    }
}, 4000);

// Inicializar posiciones limpias de la galería al cargar el script
updateGalleryPhotos();



