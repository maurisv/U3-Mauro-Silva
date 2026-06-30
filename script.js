/* ============================================================
   SCRIPT.JS — Dale Forma
   ============================================================ */

const shapes = document.querySelectorAll(".shape");
const logo = document.querySelector(".logo");

let mouseX = 0;
let mouseY = 0;

const config = [];

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

/* ANIMACIÓN HERO */
function animate() {
    const time = Date.now() * 0.001;
    const progress = Math.min(window.scrollY / window.innerHeight, 1);

    shapes.forEach((shape, index) => {
        const data = config[index];
        const floatX = Math.sin(time * data.floatSpeed + index) * data.floatAmount;
        const floatY = Math.cos(time * data.floatSpeed + index) * data.floatAmount;
        const moveY  = progress * window.innerHeight * data.fallSpeed;

        shape.style.transform = `
            translate(${mouseX + floatX}px, ${mouseY + floatY + moveY}px)
            rotate(${data.rotation}deg)
        `;
    });

    if (logo) logo.style.opacity = 1 - progress;

    requestAnimationFrame(animate);
}

/* SUBTÍTULO DINÁMICO */
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

/* Muestra el primer mensaje de inmediato al cargar, en vez de esperar
   el primer ciclo de setInterval (antes el h2 quedaba vacío unos 5s). */
if (subtitle) {
    subtitle.textContent = messages[current];
    subtitle.style.opacity = "1";
}

setInterval(changeSubtitle, 5000);
animate();


/* ===================================== */
/* SECCIÓN FIGURAS CAYENDO               */
/* ===================================== */
/* Ahora la lluvia de figuras se calcula POR CONTENEDOR (.fall-container)
   en vez de usar siempre window.innerWidth/innerHeight. Esto permite
   tener varios grupos independientes de figuras cayendo (ej. el hero
   y el bloque de "Herramientas utilizadas" en créditos), cada uno
   reciclándose dentro de los límites reales de su propio contenedor
   en vez del viewport completo. */
const fallContainers = document.querySelectorAll(".fall-container");
const fallingData = [];
let activeFigure = null;

fallContainers.forEach((container) => {
    const rect = container.getBoundingClientRect();
    const cw = rect.width  || window.innerWidth;
    const ch = rect.height || window.innerHeight;

    const shapesInContainer = container.querySelectorAll(".fall-shape");

    shapesInContainer.forEach((shape) => {
        const data = {
            element: shape,
            container: container,
            x: Math.random() * (cw - 200),
            y: Math.random() * -ch,
            speed: 1 + Math.random() * 2,
            rotation: Math.random() * 360,
            rotationSpeed: (Math.random() - 0.5) * 0.25,
            paused: false,
            dragging: false
        };

        shape.addEventListener("mouseenter", () => { if (!data.dragging) data.paused = true; });
        shape.addEventListener("mouseleave", () => { if (!data.dragging) data.paused = false; });

        shape.addEventListener("click", (e) => {
            e.stopPropagation();
            if (activeFigure === data) {
                data.dragging = false;
                data.paused   = false;
                shape.style.zIndex = "1";
                activeFigure = null;
                return;
            }
            if (activeFigure) {
                activeFigure.dragging = false;
                activeFigure.paused   = false;
                activeFigure.element.style.zIndex = "1";
            }
            activeFigure = data;
            data.dragging = true;
            data.paused   = true;
            shape.style.zIndex = "100";
        });

        fallingData.push(data);
    });
});

document.addEventListener("mousemove", (e) => {
    if (!activeFigure) return;
    const rect = activeFigure.element.getBoundingClientRect();
    const containerRect = activeFigure.container.getBoundingClientRect();
    activeFigure.x = e.clientX - containerRect.left - rect.width  / 2;
    activeFigure.y = e.clientY - containerRect.top  - rect.height / 2;
});

document.addEventListener("click", (e) => {
    if (!activeFigure) return;
    if (e.target.classList.contains("fall-shape")) return;
    activeFigure.dragging = false;
    activeFigure.paused   = false;
    activeFigure.element.style.zIndex = "1";
    activeFigure = null;
});

function animateFalling() {
    fallingData.forEach((data) => {
        const rect = data.container.getBoundingClientRect();
        const cw = rect.width  || window.innerWidth;
        const ch = rect.height || window.innerHeight;

        if (!data.paused && !data.dragging) {
            data.y        += data.speed;
            data.rotation += data.rotationSpeed;
        }
        if (data.y > ch + 250) {
            data.y     = -250;
            data.x     = Math.random() * (cw - 200);
            data.speed = 1 + Math.random() * 2;
        }
        data.element.style.transform = `translate(${data.x}px, ${data.y}px) rotate(${data.rotation}deg)`;
    });
    requestAnimationFrame(animateFalling);
}
animateFalling();

window.addEventListener("resize", () => {
    fallingData.forEach((data) => {
        const cw = data.container.getBoundingClientRect().width || window.innerWidth;
        if (data.x > cw - 100) data.x = cw - 100;
    });
});

const heroShapes    = document.querySelectorAll(".hero .shape");
const targetSection = document.querySelector("#crea-construye");

heroShapes.forEach((shape) => {
    shape.addEventListener("click", () => {
        shape.style.transition = "transform 0.6s ease";
        shape.style.transform += " translateY(300px)";
        setTimeout(() => {
            if (targetSection) targetSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 500);
    });
});


/* ===================================== */
/* SECCIÓN CARTAS                        */
/* ===================================== */
const cards       = document.querySelectorAll(".card");
const leftBtn     = document.querySelector(".card-arrow.left");
const rightBtn    = document.querySelector(".card-arrow.right");
const cardTitle   = document.getElementById("cardTitle");
const cardDescription = document.getElementById("cardDescription");

const cardData = [
    { title: "JUEGO",     description: "Contienen dos temáticas, el vocero es quien debe elegir el concepto para la partida. Todos construyen menos él." },
    { title: "FORMA",     description: "Te permitiran conseguir la victoria. Puedes obtenerlas en el mazo especial, o a través de cartas de beneficio." },
    { title: "BENEFICIO", description: "¡Qué suerte! Con ellas podrás conseguir fichas, cartas y otras ayudas para ganar la partida." },
    { title: "NEGATIVA",  description: "Entorpeceran tu progreso en la partida, pueden hacerte perder fichas o cartas Forma. ¡Ten cuidado!" }
];

let currentCard = 0;

function updateCards() {
    cards.forEach((card, index) => {
        card.classList.remove("center", "left", "right", "back");
        const total    = cards.length;
        const position = (index - currentCard + total) % total;
        if (position === 0)         card.classList.add("center");
        else if (position === 1)    card.classList.add("right");
        else if (position === total - 1) card.classList.add("left");
        else                        card.classList.add("back");
    });

    if (cardTitle && cardDescription) {
        cardTitle.classList.add("fade");
        cardDescription.classList.add("fade");
        setTimeout(() => {
            cardTitle.textContent       = cardData[currentCard].title;
            cardDescription.textContent = cardData[currentCard].description;
            cardTitle.classList.remove("fade");
            cardDescription.classList.remove("fade");
        }, 300);
    }
}

if (rightBtn) rightBtn.addEventListener("click", () => { currentCard = (currentCard + 1) % cards.length; updateCards(); });
if (leftBtn)  leftBtn.addEventListener("click",  () => { currentCard = (currentCard - 1 + cards.length) % cards.length; updateCards(); });
updateCards();


/* ===================================== */
/* INTERSECTION OBSERVER: TIEMPO         */
/* ===================================== */
const tiempoContent = document.querySelector(".tiempo-content");
if (tiempoContent) {
    const observerTiempo = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) tiempoContent.classList.add("visible");
        });
    }, { threshold: 0.3 });
    observerTiempo.observe(tiempoContent);
}


/* ===================================== */
/* SCROLL: RELOJ + EXPLOSIÓN             */
/* ===================================== */
const bombaWrapper       = document.querySelector(".bomba-wrapper");
const reloj               = document.querySelector(".reloj-img");
const fuegoImg             = document.querySelector(".fuego-img");
const tiempoSection        = document.querySelector(".tiempo-content");
const tiempoFrase          = document.getElementById("tiempoFrase");
const resultadoExplosion   = document.getElementById("resultadoExplosion");

let explosionTriggered = false;

window.addEventListener("scroll", () => {
    if (!tiempoSection || !reloj) return;
    const rect  = tiempoSection.getBoundingClientRect();
    const start = window.innerHeight * 2;
    const end   = window.innerHeight * 0.3;
    let progress = (start - rect.top) / (start - end);
    progress = Math.max(0, Math.min(progress, 1));

    // Si el usuario sube lo suficiente, rearmamos todo para que se repita
    if (explosionTriggered && progress < 0.5) {
        rearmarBomba();
    }

    if (explosionTriggered) return; // mientras está en curso o ya explotó, no tocar transform/opacity por scroll

    const translateY = 300 - (300 * progress);
    const scale      = 0.5 + (0.8 * progress);

    bombaWrapper.style.opacity   = progress;
    bombaWrapper.style.transform = `translateY(${translateY}px) rotate(8deg) scale(${scale})`;

    if (progress >= 0.98) startFuseSequence();
});

function rearmarBomba() {
    explosionTriggered = false;

    // Ocultar resultado si estaba visible
    if (resultadoExplosion) resultadoExplosion.classList.remove("visible");
    resultadoItems.forEach(i => i.classList.remove("selected"));

    // Apagar fuego y resetear bomba a estado inicial (oculta, chica)
    if (fuegoImg) fuegoImg.classList.remove("fuego-encendido");
    bombaWrapper.style.transition = "none";
    bombaWrapper.style.opacity = "0";
    bombaWrapper.style.transform = "translateY(120px) rotate(8deg) scale(0.5)";

    requestAnimationFrame(() => {
        bombaWrapper.style.transition = "opacity 0.15s ease";
    });

    // Restaurar texto del cronómetro
    if (tiempoFrase) tiempoFrase.style.opacity = "1";
}

function startFuseSequence() {
    if (explosionTriggered || !fuegoImg) return;
    explosionTriggered = true;
    fuegoImg.classList.add("fuego-encendido");

    setTimeout(triggerExplosion, 4000);
}

function triggerExplosion() {
    if (!bombaWrapper) return;

    // Ocultar bomba, fuego y el texto del cronómetro
    bombaWrapper.style.opacity = "0";
    if (tiempoFrase) tiempoFrase.style.opacity = "0";

    // Flash
    const flash = document.createElement("div");
    flash.className = "explosion-flash";
    bombaWrapper.appendChild(flash);

    // Origen de las partículas: posición del fuego dentro del wrapper
    const wrapperRect = bombaWrapper.getBoundingClientRect();
    const fuegoRect    = fuegoImg.getBoundingClientRect();
    const originX = fuegoRect.left - wrapperRect.left + fuegoRect.width / 2;
    const originY = fuegoRect.top  - wrapperRect.top  + fuegoRect.height / 2;

    const shapeAssets   = ["assets/01.png", "assets/03.png", "assets/05.png", "assets/08.png"];
    const particleCount = 14;

    for (let i = 0; i < particleCount; i++) {
        const piece = document.createElement("img");
        piece.src = shapeAssets[i % shapeAssets.length];
        piece.className = "explosion-particle";
        piece.style.left = originX + "px";
        piece.style.top  = originY + "px";

        const angle    = (Math.PI * 2 * i) / particleCount + (Math.random() * 0.5 - 0.25);
        const distance = 150 + Math.random() * 220;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 90;
        const rot = (Math.random() - 0.5) * 720;

        piece.style.setProperty("--dx", dx + "px");
        piece.style.setProperty("--dy", dy + "px");
        piece.style.setProperty("--rot", rot + "deg");

        bombaWrapper.appendChild(piece);
        setTimeout(() => piece.remove(), 1500);
    }

    setTimeout(() => flash.remove(), 450);

    // Mostrar tetera, cuchillo y plato después de la explosión
    setTimeout(() => {
        if (resultadoExplosion) resultadoExplosion.classList.add("visible");
    }, 500);
}

/* ===================================== */
/* SELECCIÓN + CELEBRACIÓN + RESET       */
/* ===================================== */
const resultadoItems       = document.querySelectorAll(".resultado-item");
const celebracionOverlay   = document.getElementById("celebracionOverlay");

resultadoItems.forEach(item => {
    item.addEventListener("click", () => {
        resultadoItems.forEach(i => i.classList.remove("selected"));
        item.classList.add("selected");
        setTimeout(mostrarCelebracion, 350);
    });
});

function mostrarCelebracion() {
    // Ocultar el resultado (título + imágenes + instrucción)
    if (resultadoExplosion) resultadoExplosion.classList.remove("visible");

    // Mostrar celebración
    if (celebracionOverlay) celebracionOverlay.classList.add("visible");
    lanzarConfeti();

    // Scroll automático hacia la siguiente sección (Galería), pero recién
    // DESPUÉS de que el mensaje "¡Excelente elección!" terminó de aparecer
    // (la animación del texto tarda ~0.5s en completarse, ver .celebracion-texto)
    const siguienteSeccion = document.getElementById("galeria");
    if (siguienteSeccion) {
        setTimeout(() => {
            siguienteSeccion.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 650);
    }

    // Después de la celebración, volver a la animación de la bomba
    setTimeout(() => {
        if (celebracionOverlay) celebracionOverlay.classList.remove("visible");
        resultadoItems.forEach(i => i.classList.remove("selected"));
        rearmarBomba();
    }, 1800);
}

function lanzarConfeti() {
    if (!celebracionOverlay) return;
    const colores = ["#e1ab04", "#60b44f", "#75cae7", "#d12839"];
    const count = 30;

    for (let i = 0; i < count; i++) {
        const piece = document.createElement("div");
        piece.className = "confeti-particle";
        piece.style.left = "50%";
        piece.style.top  = "40%";
        piece.style.background = colores[i % colores.length];
        piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "3px";

        const angle    = Math.random() * Math.PI * 2;
        const distance = 150 + Math.random() * 250;
        const dx = Math.cos(angle) * distance;
        const dy = Math.sin(angle) * distance - 60;
        const rot = (Math.random() - 0.5) * 720;

        piece.style.setProperty("--dx", dx + "px");
        piece.style.setProperty("--dy", dy + "px");
        piece.style.setProperty("--rot", rot + "deg");

        celebracionOverlay.appendChild(piece);
        setTimeout(() => piece.remove(), 1500);
    }
}

/* ===================================== */
/* GALERÍA DE FOTOS                      */
/* ===================================== */
const photos = document.querySelectorAll(".gallery-photo");
let absolutePhotoIdx = 0;

function updateGalleryPhotos() {
    const totalPhotos = photos.length;
    if (totalPhotos === 0) return;
    const currentPhotoIdx = ((absolutePhotoIdx % totalPhotos) + totalPhotos) % totalPhotos;

    photos.forEach((photo, index) => {
        photo.classList.remove("active-center", "active-left", "active-right", "hidden-back");
        const position = (index - currentPhotoIdx + totalPhotos) % totalPhotos;
        if (position === 0)              photo.classList.add("active-center");
        else if (position === 1)         photo.classList.add("active-right");
        else if (position === totalPhotos - 1) photo.classList.add("active-left");
        else                             photo.classList.add("hidden-back");
    });
}

setInterval(() => {
    if (photos.length > 0) { absolutePhotoIdx++; updateGalleryPhotos(); }
}, 4000);
updateGalleryPhotos();


/* ===================================================== */
/* ANIMACIÓN DE PIEZAS — SECCIÓN FUNDAMENTO              */
/* Se activa al entrar en la sección con IntersectionObserver
   y usa scroll interno dentro del contenedor para avanzar fases.

   AJUSTE: ahora que .fundamento-section tiene scroll-snap-align: start
   y el <html> define scroll-snap-type, el navegador frena el scroll
   justo al borde superior de la sección (pantalla centrada en ella)
   antes de que el usuario pueda seguir bajando. Por eso el threshold
   del observer se sube a 0.85: la animación solo se activa cuando la
   sección ya está prácticamente ocupando toda la pantalla (justo el
   punto en el que el snap la deja "anclada"), no apenas se empieza a
   asomar. Así la secuencia queda: 1) snap centra la sección,
   2) recién ahí el scroll empieza a mover las piezas. */
/* ── Definición de piezas ──────────────────────────────
   src  : ruta desde assets/
   w, h : tamaño renderizado en px
   kf   : 4 keyframes [{cx, cy, r}]
          cx/cy = centro dentro del stage de 560×560 px
          r     = rotación en grados
   Fases:
     0 = disperso inicial  (in1)
     1 = robot armado      (in2)
     2 = disperso 2        (in3)
     3 = órbita            (in4)
──────────────────────────────────────────────────────── */
const PIECES = [
    {
        id: "tri", src: "assets/05.png", w: 155, h: 138,
        kf: [
            { cx: 125, cy: 125, r: -150, s: 1     },
            { cx: 280, cy: 85,  r: 0,  s: 1     },
            { cx: 500, cy: 400, r: 120,  s: 1     },
            { cx: 91,  cy: 252, r: -100,   s: 0.923 }
        ]
    },
    {
        id: "cir", src: "assets/03.png", w: 148, h: 148,
        kf: [
            { cx: 279, cy: 217, r: 0,    s: 1     },
            { cx: 280, cy: 201, r: 0,    s: 1     },
            { cx: 165, cy: 120, r: 0,    s: 1     },
            { cx: 240, cy: 224, r: -167, s: 0.65 }
        ]
    },
    {
        id: "sqA", src: "assets/01.png", w: 155, h: 155,
        kf: [
            { cx: 106, cy: 297, r: 61,  s: 1     },
            { cx: 280, cy: 342, r: 0,  s: 1     },
            { cx: 315, cy: 233, r: 111, s: 1     },
            { cx: 420, cy: 270, r: 175, s: 0.923 }
        ]
    },
    {
        id: "sqB", src: "assets/01.png", w: 138, h: 138,
        kf: [
            { cx: 454, cy: 340, r: 61,  s: 1     },
            { cx: 281, cy: 490, r: 0, s: 1.1     },
            { cx: 240, cy: 440, r: 69,  s: 1     },
            { cx: 550, cy: 370, r: 171, s: 0.923 }
        ]
    },
    {
        id: "arc1", src: "assets/08.png", w: 200, h: 200,
        kf: [
            { cx: 238, cy: 465, r: 156,  s: 1     },
            { cx: 105, cy: 273, r: 0, s: 1     },
            { cx: 70, cy: 278, r: -146, s: 1     },
            { cx: 286, cy: 380, r: 330, s: 0.923 }
        ]
    },
    {
        id: "arc2", src: "assets/08.png", w: 200, h: 200,
        kf: [
            { cx: 410, cy: 121, r: -360, s: 1     },
            { cx: 456, cy: 410, r: 180, s: 1     },
            { cx: 428, cy: 146, r: 180, s: 1     },
            { cx: 240, cy: 135, r: 135,  s: 0.7 }
        ]
    }
];

const PHASE_NAMES = ["Disperso", "Robot", "Disperso", "Órbita"];

/* ── Párrafos dinámicos: cambian según la fase del morph ── */
const PHASE_PARAGRAPHS = [
    "La propuesta de la interfaz expresiva explora cómo los elementos individuales se reúnen para poder conformar una unidad mayor, donde la transformación cumple un rol fundamental, no solo como un cambio visual, sino también como una modificación del usuario en la manera que percibe y reinterpreta a través de las mismas figuras concebidas.",
    "Se definen construcciones predeterminadas que guían al usuario durante la interacción con la interfaz. Este primer espacio de exploración presenta el vacío como un lienzo donde las figuras dan espacio al juego, a la experimentación y al acto de dar forma. A medida que interactúa con ellas, el usuario comienza a comprender cómo se organiza cada composición antes de intervenir sobre ella.",
    "Al completar la reconstrucción, el usuario ya es capaz de transformarla tantas veces como desee, convirtiendo las composiciones en un punto de partida para la metamorfosis de cada una, ya sea moviendo, rotando o eliminando las partes que la constituyen.",
    "Finalmente, la experiencia deja de centrarse en una única solución y se transforma en una exploración abierta de nuevas posibilidades. El objetivo ya no consiste únicamente en reconstruir una figura predeterminada, sino en fomentar la experimentación y el descubrimiento."
];
const fundamentoIntroEl = document.getElementById("fundamentoIntro");
let lastParagraphPhase = -1;

function updateFundamentoParagraph(phase) {
    if (!fundamentoIntroEl || phase === lastParagraphPhase) return;
    lastParagraphPhase = phase;

    fundamentoIntroEl.classList.add("is-changing");
    setTimeout(() => {
        fundamentoIntroEl.textContent = PHASE_PARAGRAPHS[phase];
        fundamentoIntroEl.classList.remove("is-changing");
    }, 280);
}

/* ── Helpers de interpolación ── */
function easeInOut(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
}
function lerp(a, b, t)      { return a + (b - a) * t; }
function lerpAngle(a, b, t) { const d = ((b - a + 180) % 360) - 180; return a + d * t; }

/* ── Estado de la animación ── */
let morphPhaseF  = 0;
let morphTarget  = 0;
let morphRaf     = null;
let morphPrevT   = null;
let morphActive  = false;   // true cuando la sección está anclada (snap) y lista para recibir scroll

/* ── Referencias DOM (se resuelven después del DOMContentLoaded) ── */
const morphStage     = document.getElementById("stage");
const morphOverlay   = document.getElementById("fundamento-overlay");
const morphHint      = document.getElementById("hint");
const morphPhaseName = document.getElementById("phase-name");

/* ── Construir piezas en el stage ── */
PIECES.forEach(p => {
    const el = document.createElement("div");
    el.id    = "p-" + p.id;
    el.className = "morph-piece";
    el.style.cssText = `position:absolute; width:${p.w}px; height:${p.h}px; left:0; top:0; will-change:transform; transform-origin:center center; pointer-events:none;`;
    el.innerHTML = `<img src="${p.src}" style="width:100%;height:100%;object-fit:contain;display:block;" draggable="false" alt="">`;
    if (morphStage) morphStage.appendChild(el);
});

/* ── Render ── */
function morphRender(f) {
    f = Math.max(0, Math.min(2.9999, f));
    const i = Math.floor(f);
    const t = easeInOut(f - i);

    PIECES.forEach(p => {
        const el = document.getElementById("p-" + p.id);
        if (!el) return;
        const a  = p.kf[i];
        const b  = p.kf[Math.min(i + 1, 3)];
        const cx = lerp(a.cx, b.cx, t);
        const cy = lerp(a.cy, b.cy, t);
        const r  = lerpAngle(a.r, b.r, t);
        const s  = lerp(a.s !== undefined ? a.s : 1, b.s !== undefined ? b.s : 1, t);
        el.style.transform = `translate(${cx - p.w / 2}px, ${cy - p.h / 2}px) rotate(${r}deg) scale(${s})`;
    });

    const ph = Math.min(Math.round(f), 3);
    if (morphPhaseName) morphPhaseName.textContent = PHASE_NAMES[ph];
    document.querySelectorAll(".morph-dot").forEach(d =>
        d.classList.toggle("on", +d.dataset.i === ph)
    );
    if (morphHint) morphHint.style.opacity = f < 0.15 ? "1" : "0.3";
    updateFundamentoParagraph(ph);
}

/* ── Loop de animación suave ── */
function morphLoop(ts) {
    if (!morphPrevT) morphPrevT = ts;
    const dt   = Math.min(ts - morphPrevT, 60) / 1000;
    morphPrevT = ts;
    const diff = morphTarget - morphPhaseF;

    if (Math.abs(diff) > 0.001) {
        morphPhaseF += diff * Math.min(dt * 6, 1);
        morphRender(morphPhaseF);
        morphRaf = requestAnimationFrame(morphLoop);
    } else {
        morphPhaseF = morphTarget;
        morphRender(morphPhaseF);
        morphRaf = null;
    }
}

function morphGo(dir) {
    morphTarget = Math.max(0, Math.min(3, Math.round(morphTarget) + dir));
    if (!morphRaf) { morphPrevT = null; morphRaf = requestAnimationFrame(morphLoop); }
}

/* ── Inputs: wheel y touch en TODA la pantalla mientras la sección
   fundamento está activa (morphActive). Antes solo se escuchaba sobre
   .fundamento-section, por eso el scroll no respondía fuera de las figuras. ── */
let morphWheelAcc = 0;
window.addEventListener("wheel", (e) => {
    if (!morphActive) return;

    /* Si ya estamos en la última fase, dejamos hacer scroll normal hacia abajo
       (avanza a la siguiente sección, .experiencia-section) */
    if (morphTarget >= 3 && e.deltaY > 0) return;
    /* Si estamos en la primera fase, dejamos hacer scroll normal hacia arriba
       (vuelve a la sección anterior, la galería) */
    if (morphTarget <= 0 && e.deltaY < 0) return;

    e.preventDefault();
    morphWheelAcc += e.deltaY;
    if (morphWheelAcc >  150) { morphWheelAcc = 0; morphGo(1);  }
    if (morphWheelAcc < -150) { morphWheelAcc = 0; morphGo(-1); }
}, { passive: false });

let morphTouchY = 0;
window.addEventListener("touchstart", e => { morphTouchY = e.touches[0].clientY; }, { passive: true });
window.addEventListener("touchmove", e => {
    if (!morphActive) return;
    /* Igual que con wheel: si estamos en un extremo, dejamos pasar el
       scroll táctil normal para que avance/retroceda de sección */
    const dy = morphTouchY - e.touches[0].clientY;
    if (morphTarget >= 3 && dy > 0) return;
    if (morphTarget <= 0 && dy < 0) return;
    e.preventDefault();
}, { passive: false });
window.addEventListener("touchend", e => {
    if (!morphActive) return;
    const dy = morphTouchY - e.changedTouches[0].clientY;
    if (Math.abs(dy) > 55) morphGo(dy > 0 ? 1 : -1);
}, { passive: true });

/* ── IntersectionObserver: activa/desactiva la animación ──
   threshold alto (0.85) para que coincida con el momento en que el
   scroll-snap ya dejó la sección anclada y centrada en pantalla,
   en vez de activarse apenas la sección empieza a asomar. */
const fundamentoSection = document.querySelector(".fundamento-section");
if (fundamentoSection) {
    const morphObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            morphActive = entry.isIntersecting;
        });
    }, { threshold: 0.85 });
    morphObserver.observe(fundamentoSection);
}

/* Render inicial */
morphRender(0);
/* ===================================== */
/* REVELADO DE TEXTOS HACIA ARRIBA       */
/* ===================================== */
/* Todo elemento con el atributo data-reveal arranca oculto y
   desplazado hacia abajo (vía CSS). Cuando entra en el viewport,
   se le agrega la clase "reveal-in", que lo sube a su posición
   final con fade-in (translateY + opacity, ver style.css).
   Es un efecto de una sola vez por elemento (no continuo como el
   parallax clásico), pensado solo para textos en toda la interfaz.
   No toca imágenes/objetos ni elementos ya animados por otra
   lógica (bomba, figuras cayendo, piezas del fundamento, etc.). */

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const revealElements = document.querySelectorAll("[data-reveal]");

if (revealElements.length) {
    if (prefersReducedMotion) {
        // Sin animación: mostrar todo directamente
        revealElements.forEach((el) => el.classList.add("reveal-in"));
    } else {
        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("reveal-in");
                    revealObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.2, rootMargin: "0px 0px -10% 0px" });

        revealElements.forEach((el) => revealObserver.observe(el));
    }
}