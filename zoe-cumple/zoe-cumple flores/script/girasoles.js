// 🌻 Genera el SVG de un girasol

function makeSunflowerSVG() {
    let petals = "";
    for (let i = 0; i < 10; i++) {
        const angle = i * 36;
        petals += `<ellipse class="sf-petal" cx="30" cy="34" rx="6" ry="17" transform="rotate(${angle} 30 55)" />`;
    }

    return `
        <svg class="sunflower-svg" viewBox="0 0 60 150">
            <line x1="30" y1="150" x2="30" y2="60" class="sf-stem" />
            <path d="M20 95 Q4 100 13 112" class="sf-leaf" />
            <path d="M40 108 Q56 112 47 124" class="sf-leaf" />
            <g class="sf-head">
                <g class="sf-petals">${petals}</g>
                <circle cx="30" cy="55" r="13" class="sf-center" />
            </g>
        </svg>
    `;
}

// ---------- campo de girasoles ----------

const field = document.getElementById("sunflower-field");
const isSmallScreen = window.innerWidth < 480;

// tres capas: fondo (más, chicas, tenues) -> medio -> frente (menos, grandes, nítidas)
// cantidades pensadas para que se vea lleno pero AIREADO, sobre todo en teléfono
const LAYERS = isSmallScreen
    ? [
        { count: 10, scale: [0.2, 0.36], opacity: [0.4, 0.6] },
        { count: 6, scale: [0.4, 0.62], opacity: [0.65, 0.85] },
        { count: 4, scale: [0.65, 0.95], opacity: [0.95, 1] },
    ]
    : [
        { count: 16, scale: [0.2, 0.36], opacity: [0.4, 0.6] },
        { count: 9, scale: [0.4, 0.65], opacity: [0.65, 0.85] },
        { count: 6, scale: [0.65, 1.05], opacity: [0.95, 1] },
    ];

LAYERS.forEach((layer) => {
    // reparte cada capa en franjas del ancho para que no se amontonen
    // y deja un huequito aleatorio dentro de cada franja, para que no se vea en fila
    const slot = 100 / layer.count;

    for (let i = 0; i < layer.count; i++) {
        const flower = document.createElement("div");
        flower.className = "sunflower";

        const jitter = (Math.random() - 0.5) * slot * 0.7;
        const left = Math.min(97, Math.max(1, slot * i + slot / 2 + jitter));
        const scale = layer.scale[0] + Math.random() * (layer.scale[1] - layer.scale[0]);
        const opacity = layer.opacity[0] + Math.random() * (layer.opacity[1] - layer.opacity[0]);
        const delay = (Math.random() * 4).toFixed(2);
        const duration = (4 + Math.random() * 3).toFixed(2);

        flower.style.left = left + "%";
        flower.style.setProperty("--scale", scale.toFixed(2));
        flower.style.setProperty("--delay", delay + "s");
        flower.style.setProperty("--duration", duration + "s");
        flower.style.opacity = opacity.toFixed(2);
        flower.style.zIndex = Math.round(scale * 10);

        flower.innerHTML = makeSunflowerSVG();
        field.appendChild(flower);
    }
});

// el campo se inclina levemente hacia donde está el cursor

const fieldScreen = document.getElementById("field-screen");

fieldScreen.addEventListener("mousemove", (e) => {
    const ratio = e.clientX / window.innerWidth - 0.5; // -0.5 a 0.5
    field.style.setProperty("--tilt", (ratio * 6).toFixed(2) + "deg");
});

fieldScreen.addEventListener("mouseleave", () => {
    field.style.setProperty("--tilt", "0deg");
});

// motitas de luz subiendo, para que el espacio arriba del campo no se sienta vacío

const pollenContainer = document.getElementById("pollen-container");

function spawnPollen() {
    if (!pollenContainer) return;
    const dot = document.createElement("div");
    dot.className = "pollen-dot";
    const size = 3 + Math.random() * 4;
    dot.style.width = size + "px";
    dot.style.height = size + "px";
    dot.style.left = 5 + Math.random() * 90 + "%";
    dot.style.setProperty("--drift", (Math.random() * 40 - 20).toFixed(0) + "px");
    const duration = 7 + Math.random() * 6;
    dot.style.animationDuration = duration.toFixed(2) + "s";
    pollenContainer.appendChild(dot);
    setTimeout(() => dot.remove(), duration * 1000 + 200);
}

for (let i = 0; i < 6; i++) {
    setTimeout(spawnPollen, i * 600);
}
setInterval(spawnPollen, 900);

// pétalos cayendo de vez en cuando

const petalsContainer = document.getElementById("petals-container");

function spawnPetal() {
    const petal = document.createElement("div");
    petal.className = "petal-fall";
    petal.style.left = Math.random() * 100 + "%";
    const duration = 6 + Math.random() * 5;
    petal.style.animationDuration = duration.toFixed(2) + "s";
    petalsContainer.appendChild(petal);
    setTimeout(() => petal.remove(), duration * 1000 + 200);
}

setInterval(spawnPetal, 2200);

// ---------- girasol final (más grande) ----------

const finalSunflower = document.getElementById("finalSunflower");
if (finalSunflower) {
    finalSunflower.innerHTML = makeSunflowerSVG();
}

// ---------- botón "abre tu campo" ----------

const openBtn = document.getElementById("openFieldBtn");
if (openBtn) {
    openBtn.addEventListener("click", () => {
        document.getElementById("field-screen").scrollIntoView({ behavior: "smooth" });
    });
}

// ---------- revelar elementos al hacer scroll ----------

const revealTargets = document.querySelectorAll(".reveal-target");

const revealObserver = new IntersectionObserver(
    (entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add("visible");
                revealObserver.unobserve(entry.target);
            }
        });
    },
    { threshold: 0.3 }
);

revealTargets.forEach((el) => revealObserver.observe(el));

// ---------- recuerdos: tarjetas que se voltean, como un mini juego ----------

const memoryCards = document.querySelectorAll(".memory-flower");
const memoriesCounter = document.getElementById("memoriesCounter");
const foundMemories = new Set();

function celebrateAllFound() {
    // ráfaga de pétalos como pequeña sorpresa al encontrarlos todos
    for (let i = 0; i < 24; i++) {
        setTimeout(spawnPetal, i * 60);
    }
    if (memoriesCounter) {
        memoriesCounter.textContent = "encontraste los 5 🌻";
    }
}

function toggleMemory(card, index) {
    const isOpen = card.classList.toggle("open");
    card.setAttribute("aria-pressed", isOpen ? "true" : "false");

    if (isOpen && !foundMemories.has(index)) {
        foundMemories.add(index);
        card.classList.add("found");

        if (memoriesCounter && foundMemories.size < memoryCards.length) {
            memoriesCounter.textContent = `${foundMemories.size} / ${memoryCards.length} encontrados`;
        }

        if (foundMemories.size === memoryCards.length) {
            celebrateAllFound();
        }
    }
}

memoryCards.forEach((card, index) => {
    card.addEventListener("click", () => toggleMemory(card, index));
    card.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            toggleMemory(card, index);
        }
    });
});
