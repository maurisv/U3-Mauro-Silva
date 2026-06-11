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
        offset: centerOffsets[index]
    });

});

/* PARALLAX */

document.addEventListener("mousemove", (e) => {

    mouseX =
        (e.clientX - window.innerWidth / 2) * 0.02;

    mouseY =
        (e.clientY - window.innerHeight / 2) * 0.02;

});

/* ANIMACIÓN */

function animate() {

    const time = Date.now() * 0.001;

    const progress = Math.min(
        window.scrollY / window.innerHeight,
        1
    );

    shapes.forEach((shape, index) => {

    const data = config[index];

    const floatX =
        Math.sin(
            time * data.floatSpeed + index
        ) * data.floatAmount;

    const floatY =
        Math.cos(
            time * data.floatSpeed + index
        ) * data.floatAmount;

    const rect = shape.getBoundingClientRect();

    const shapeCenterX =
        rect.left + rect.width / 2;

    const shapeCenterY =
        rect.top + rect.height / 2;

    const dx =
        (centerX - shapeCenterX) * 0.88;

    const dy =
        (centerY - shapeCenterY) * 0.88;

    const progress = Math.min(
        window.scrollY / window.innerHeight,
        1
    );

    const moveX = dx * progress;
    const moveY = dy * progress;

    shape.style.transform = `
        translate(
            ${mouseX + floatX + moveX}px,
            ${mouseY + floatY + moveY}px
        )
        rotate(${data.rotation}deg)
    `;

});

    /* DESAPARECER LOGO */

    if (logo) {
        logo.style.opacity = 1 - progress;
    }

    requestAnimationFrame(animate);
}

animate();

/* ========================= */
/* GALERIA SCROLL */
/* ========================= */

const gallery = document.querySelector(".transformacion-scroll");
const panels = document.querySelectorAll(".panel");

window.addEventListener("scroll", () => {

    if (!gallery) return;

    const rect = gallery.getBoundingClientRect();

    const progress = Math.max(
        0,
        Math.min(
            1,
            -rect.top / (gallery.offsetHeight - window.innerHeight)
        )
    );

    const panelIndex = Math.min(
        panels.length - 1,
        Math.floor(progress * panels.length)
    );

    panels.forEach(panel =>
        panel.classList.remove("active")
    );

    panels[panelIndex].classList.add("active");

});