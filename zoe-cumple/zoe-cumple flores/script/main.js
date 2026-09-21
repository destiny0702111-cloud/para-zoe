const gift = document.querySelector(".gift-box");

const stars = document.getElementById("stars");

createStars();

function randomizeLeoStars(){

    const leoStars = document.querySelectorAll(".leo-star");
    const variants = ["leoBreath", "leoBreathA", "leoBreathB", "leoBreathC"];
    const easings = ["ease-in-out", "ease-in", "ease-out", "cubic-bezier(.37,0,.63,1)"];

    leoStars.forEach(star => {

        const duration = 3 + Math.random() * 3.5;
        const variant = variants[Math.floor(Math.random() * variants.length)];
        const easing = easings[Math.floor(Math.random() * easings.length)];

        star.style.animation = `${variant} ${duration}s ${easing} ${Math.random() * -duration}s infinite`;

    });

}

randomizeLeoStars();

function createStars(){

    // ⭐ Estrellas pequeñas
    createGroup(350,1,2);

    // ✨ Estrellas medianas
    createGroup(170,2,3);

    // 🌟 Estrellas grandes
    createGroup(90,3,5);

}

function createGroup(quantity,min,max){

    const breathingVariants = ["starBreathing", "starBreathingA", "starBreathingB", "starBreathingC"];
    const easings = ["ease-in-out", "ease-in", "ease-out", "cubic-bezier(.37,0,.63,1)"];

    for(let i=0;i<quantity;i++){

        const star=document.createElement("div");

        star.classList.add("star");

        const size=Math.random()*(max-min)+min;

        star.style.width=size+"px";
        star.style.height=size+"px";

        star.style.left=Math.random()*100+"%";

        // 👇 CORREGIDO: Ahora las estrellas cubren el 100% de la pantalla (el CSS de máscara se encarga de difuminarlas abajo)
        star.style.top=Math.random()*100+"%";

        star.style.opacity=Math.random()*0.6+0.35;

        // Cada estrella respira con su propia duración, curva y punto de partida
        const duration = 2.5 + Math.random() * 6.5;
        const variant = breathingVariants[Math.floor(Math.random() * breathingVariants.length)];
        const easing = easings[Math.floor(Math.random() * easings.length)];

        star.style.animation = `${variant} ${duration}s ${easing} ${Math.random() * -duration}s infinite`;

        stars.appendChild(star);

    }

}

// ===========================
//    ESTRELLAS FUGACES DINÁMICAS
// ===========================
function createShootingStar() {
    const container = document.getElementById("shooting-stars-container");
    if (!container) return;

    const star = document.createElement("div");
    star.classList.add("shooting-star");

    const posX = Math.random() * window.innerWidth;
    const posY = Math.random() * (window.innerHeight * 0.5);

    star.style.left = posX + "px";
    star.style.top = posY + "px";

    const duration = 1.2 + Math.random() * 1.5;
    star.style.animation = `shoot ${duration}s ease-out forwards`;

    container.appendChild(star);

    setTimeout(() => {
        star.remove();
    }, duration * 1000);
}

function initShootingStars() {
    function scheduleNext() {
        if (!shootingStarsActive) return;

        const delay = 900 + Math.random() * 1600; // antes: 4000-8000ms, ahora mucho más seguido

        setTimeout(() => {
            if (!shootingStarsActive) return;

            createShootingStar();

            // 35% de probabilidad de que pase una segunda estrella casi junto a la primera
            if (Math.random() < 0.35) {
                setTimeout(() => {
                    if (shootingStarsActive) createShootingStar();
                }, 150 + Math.random() * 250);
            }

            scheduleNext();
        }, delay);
    }

    scheduleNext();
}

let shootingStarsActive = true;

initShootingStars();

// ===========================
//   LUCES BOKEH (PANTALLA DE RECUERDOS)
// ===========================
function createBokehLights() {
    const container = document.getElementById("bokehLights");
    if (!container) return;

    const quantity = 22;

    for (let i = 0; i < quantity; i++) {
        const dot = document.createElement("div");
        dot.classList.add("bokeh-dot");

        const size = 4 + Math.random() * 10;
        dot.style.width = size + "px";
        dot.style.height = size + "px";
        dot.style.left = Math.random() * 100 + "%";
        dot.style.top = Math.random() * 100 + "%";

        const duration = 6 + Math.random() * 6;
        dot.style.animation = `bokehFloat ${duration}s ease-in-out ${Math.random() * -duration}s infinite`;

        container.appendChild(dot);
    }
}

createBokehLights();

const welcome = document.getElementById("welcome-screen");

const terminal = document.getElementById("terminal-screen");

const terminalText = document.getElementById("terminal");

const memoryScreen = document.getElementById("memory-screen");

// ===========================
//   ABSORCIÓN HACIA EL REGALO
// ===========================
function getElementCenter(el){
    const rect = el.getBoundingClientRect();
    return {
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2
    };
}

function absorbElements(elements, {spread = 900, duration = 900, easing = "cubic-bezier(.55,0,.85,.45)"} = {}){
    return new Promise(resolve => {

        const giftCenter = getElementCenter(document.getElementById("gift"));
        const valid = elements.filter(Boolean);

        // Medimos la distancia de cada elemento al regalo, para que el barrido
        // de absorción respete un orden: los cercanos primero, los lejanos al final
        const measured = valid.map(el => {

            const computed = getComputedStyle(el).transform;
            const baseTransform = (computed && computed !== "none") ? computed : "";
            const center = getElementCenter(el);
            const dx = giftCenter.x - center.x;
            const dy = giftCenter.y - center.y;
            const distance = Math.hypot(dx, dy);

            return { el, baseTransform, dx, dy, distance };

        });

        const maxDistance = Math.max(...measured.map(m => m.distance), 1);
        let maxTotal = 0;

        measured.forEach(({el, baseTransform, dx, dy, distance}) => {

            // congelamos SOLO la animación del propio elemento (p. ej. el flote del UFO
            // o el vuelo de una estrella fugaz) — sus hijos (luces, estrellas internas)
            // pueden seguir con su animación normal hasta que se desvanezcan
            el.style.animation = "none";
            el.style.transform = baseTransform;

            // forzamos reflow para registrar el estado congelado antes de animar
            void el.offsetWidth;

            // más cerca del regalo = empieza antes | más lejos = empieza después
            const proximityDelay = (distance / maxDistance) * spread;
            const delay = proximityDelay + Math.random() * 150;
            const dur = duration + Math.random() * 300;

            maxTotal = Math.max(maxTotal, delay + dur);

            el.style.transition =
                `transform ${dur}ms ${easing} ${delay}ms, opacity ${Math.round(dur * 0.85)}ms ease-in ${delay}ms`;
            el.style.transform = `${baseTransform} translate(${dx}px, ${dy}px) scale(0)`.trim();
            el.style.opacity = "0";

        });

        setTimeout(resolve, maxTotal + 150);

    });
}

function absorbStarField(){
    // estrellas normales + estrellas fugaces que estén en pantalla en ese momento
    const stars = Array.from(document.querySelectorAll(".star"));
    const shootingStars = Array.from(document.querySelectorAll(".shooting-star"));

    return absorbElements([...stars, ...shootingStars], { spread: 1500, duration: 1250 });
}

function absorbLeoAndPlanets(){
    // la constelación de Leo, los planetas y la nave, todos juntos
    const leo = document.getElementById("leo");
    const planets = Array.from(document.querySelectorAll(".planet, .ufo"));

    return absorbElements([leo, ...planets], { spread: 1100, duration: 1250 });
}

function absorbTitle(){
    // "Feliz cumpleaños", "Zoe" y el corazón — absorbidos al final de todo
    const els = Array.from(document.querySelectorAll(".birthday-title h1, .birthday-title h2, .birthday-title p"));

    return absorbElements(els, { spread: 500, duration: 950 });
}

gift.addEventListener("click", async () => {

    if (gift.dataset.opening) return;
    gift.dataset.opening = "true";

    shootingStarsActive = false; // dejamos de crear nuevas estrellas fugaces

    await absorbStarField();
    await absorbLeoAndPlanets();
    await absorbTitle();

    gift.classList.add("gift-open");

    await wait(1200);

    welcome.style.opacity="0";

    await wait(1000);

    welcome.style.display="none";

    terminal.style.display="flex";

    await wait(100);

    terminal.style.opacity="1";

    const flash = document.getElementById("terminalFlash");
    if (flash) {
        flash.classList.add("boot");
    }

    startTerminal();

});

async function typeLine(text, isError = false){

    const line = document.createElement("p");
    if (isError) line.classList.add("error-line");
    terminalText.appendChild(line);

    for(let i = 0; i < text.length; i++){
        line.innerHTML =
            text.substring(0, i + 1) +
            '<span class="cursor">|</span>';
            
        terminalText.scrollTop = terminalText.scrollHeight;

        await wait(35);
    }

    line.textContent = text;
}

async function typeProgressBar(label, durationMs){

    const line = document.createElement("p");
    line.classList.add("progress-line");
    terminalText.appendChild(line);

    const totalTicks = 10;
    const stepDelay = durationMs / totalTicks;

    for(let i = 1; i <= totalTicks; i++){

        const filled = "■".repeat(i);
        const empty = "□".repeat(totalTicks - i);
        const percent = i * 10;

        line.textContent = `${label} [${filled}${empty}] ${percent}%`;

        terminalText.scrollTop = terminalText.scrollHeight;

        await wait(stepDelay);
    }
}
function wait(ms){

    return new Promise(resolve => setTimeout(resolve, ms));

}

async function startTerminal(){

    await wait(500);

    await typeLine("> Inicializando regalo...");


    await wait(1200);

    await typeLine("> Buscando cumpleañera...");


    await wait(1200);

    await typeLine("✔ Cumpleañera encontrada");


    await wait(1200);

    await typeLine("> Buscando persona favorita...");


    await wait(1200);

    await typeLine("✔ Zoe encontrada");

    await wait(1200);

await typeLine("> Cargando recuerdos...");

await typeProgressBar("Progreso", 2200);

await wait(600);

await typeLine("");


await typeLine("ERROR", true);

await wait(1000);

await typeLine("> Recuerdos juntos no encontrados...");

await wait(1500);

await typeLine("✔ Pero se hara realidad...");

await wait(2000);

await typeLine("✔ Te lo prometo...");

await wait(2000);

await typeLine("> Buscando en la base de datos...");

await wait(3000);

await typeLine("> Analizando mensajes...");


await wait(1000);

await typeLine("> Analizando noches compartidas...");


await wait(1000);

await typeLine("> Analizando risas...");


await wait(1000);

await typeLine("> Analizando llamadas...");

await wait(1500);

await typeLine("");


await typeLine("ERROR", true);

await wait(1000);

await typeLine("> Memoria insuficiente...");

await wait(800);

await typeLine("> Intentando comprimir recuerdos...");

await wait(800);

await typeLine("> Imposible");

await wait(800);

await typeLine("✔ Hay personas que simplemente no caben en la memoria.");

await wait(2500);

await typeLine("✔ Creando un nuevo archivo...");

await wait(1800);

terminal.style.opacity = "0";

await wait(1000);

terminal.style.display = "none";

memoryScreen.style.display = "flex";

memoryScreen.style.opacity = "0";

await wait(50);

memoryScreen.style.opacity = "1";

await wait(1200);


await wait(1800);

document
    .querySelectorAll(".desktop-photo, .mobile-photo")
    .forEach(photo => {

        photo.style.opacity = "1";

        photo.style.transform = "translateY(0)";

    });

await wait(1200);

const caption = document.querySelector(".photo-caption");

caption.style.opacity = "1";
caption.style.transform = "translateY(0)";

await wait(1500);

const indicator = document.querySelector(".scroll-indicator");

indicator.style.opacity = "1";
indicator.style.transform = "translateY(0)";

}

// ===========================
//   SOBRE / CARTA
// ===========================
const envelope = document.getElementById("envelope");
const envelopeWrapper = document.getElementById("envelopeWrapper");
const letterOverlay = document.getElementById("letterOverlay");
const letterPaper = document.getElementById("letterPaper");
const letterClose = document.getElementById("letterClose");

let letterWritten = false;

if (envelope) {

    envelope.addEventListener("click", () => {

        if (envelope.dataset.opening) return;
        envelope.dataset.opening = "true";

        // 1. se abre la tapa del sobre y se desvanece el sello
        envelope.classList.add("opening");

        // 2. el sobre completo se encoge y desaparece
        setTimeout(() => {
            envelopeWrapper.classList.add("hidden");
        }, 450);

        // 3. la carta flota hacia el centro de la pantalla y se desdobla
        setTimeout(() => {

            envelopeWrapper.style.display = "none";

            letterOverlay.style.display = "flex";

            // forzamos reflow para que la transición se vea desde el estado inicial
            void letterOverlay.offsetWidth;

            letterOverlay.classList.add("visible");
            letterPaper.classList.add("visible");

            // 4. cuando termina de desdoblarse, el texto se escribe solo
            setTimeout(() => {
                if (!letterWritten) {
                    letterWritten = true;
                    writeLetter();
                }
            }, 750);

        }, 900);

    });

}

function closeLetter(){

    letterOverlay.classList.remove("visible");
    letterPaper.classList.remove("visible");

    setTimeout(() => {
        letterOverlay.style.display = "none";

        // regresamos el sobre para que se pueda volver a abrir
        envelope.classList.remove("opening");
        envelopeWrapper.style.display = "flex";

        void envelopeWrapper.offsetWidth;

        envelopeWrapper.classList.remove("hidden");
        delete envelope.dataset.opening;
    }, 500);

}

if (letterClose) {
    letterClose.addEventListener("click", closeLetter);
}

if (letterOverlay) {
    letterOverlay.addEventListener("click", (e) => {
        if (e.target === letterOverlay) closeLetter();
    });
}

const paragraphs = [

`Hola niña, feliz cumpleaños.`,

`Hoy no estoy contigo para abrazarte como me lo pediste, ni para celebrar este día
como me gustaría. Pero espero que algún día podamos hacerlo, si tú también quieres`,

`¿Ya hace cuánto tiempo que te conozco? La verdad ya perdí la cuenta... aunque,
siendo sincero, todavía siento que no es suficiente`,

`Gracias por hacerme sentir que contigo no hace falta actuar. Gracias por dejarme
conocer a la Zoe que eructa, que hace bromas tontas, que se ríe, que se enoja
cuando la empujo y sale volando, que me cuenta cosas que podrían incomodar a
cualquiera y las convierte simplemente en una conversación más. Gracias por confiar
en mí para ser tú. Ojalá algún día entiendas lo valioso que ha sido para mí ese regalo.
Creo que ese es uno de los regalos más bonitos que alguien puede darle a otra
persona.`,

`Todavía sigo pensando que uno de mis recuerdos favoritos contigo no es una gran
aventura ni algo espectacular. Es mucho más simple que eso: es acordarme de ti
leyéndome cuentos mientras yo me quedaba dormido. Suena hasta ridículo escrito
así, pero creo que nunca entendiste lo mucho que significó para mí algo tan sencillo.
Tú seguramente solo estabas leyendo una historia; yo encontraba una tranquilidad
que hacía mucho no sentía`,

`No sé si alguna vez te has dado cuenta, pero contigo aprendí que la tranquilidad
también puede venir de una persona. Hay días en los que simplemente hablar contigo
hace que todo se sienta un poquito más ligero. No porque resuelvas mis problemas,
sino porque, de alguna manera, haces que pesen menos. Y creo que nunca te había
dado las gracias por eso. Nunca pensé que terminaría esperando con tanta ilusión
una llamada para jugar, escuchar música o simplemente hablar de cualquier tontería.`,

`Aunque, si soy completamente honesto, también me acuerdo de aquella partida
donde te empujé y saliste volando justo en el peor momento posible, para
terminar explotando. Creo que nunca me había reído tanto jugando algo. Perdón...
bueno, no tanto.`,

`Hay algo que probablemente nunca te he dicho: admiro muchísimo la persona en la
que te has convertido. Y lo curioso es que creo que ni siquiera tú te das cuenta.
Admiro la forma en la que te entregas a las cosas que te importan y gustan
,la alegría con la que vives las pequeñas cosas y esa capacidad que tienes
para seguir adelante incluso cuando tú misma sientes que no sabes muy bien
hacia dónde vas.`,

`Creo que eres un poco como el sol. Estás muy lejos de mí, pero aun así consigues
hacerme sentir tu calor.`,

`Hay algo que muchas veces damos por hecho y que yo no quiero dejar pasar: gracias
por elegirme para compartir una parte de tu vida. Gracias por cada llamada, cada
noche, cada historia, cada reel, cada conversación sin sentido, cada vez que me
buscaste y me enseñaste lo bonito que se siente que alguien te quiera de la manera
en la que tú sabes querer, y sobre todo por aguantar mis dramas de diva y cada
momento en el que simplemente decidiste quedarte un rato más.`,

`Puede que para ti hayan sido cosas normales, pero para mí terminaron 
convirtiéndose en recuerdos que voy a guardar con muchísimo cariño, porque
eres esa persona que no buscaba en mi vida y que necesitaba desesperadamente.`,

`Eres mi Wanviwah y yo me siento tan Phleng. Solo que no te voy a dejar esperando 13
años.`,

`No sé qué vaya a pasar dentro de cinco o diez años. No sé dónde estaremos ni qué
estará haciendo cada uno. Pero sí sé algo: nunca voy a querer que sientas que
conmigo tienes que ser alguien diferente. Si algún día estás perdida, feliz, rota,
emocionada, si necesitas reírte, desahogarte, contarme algo que te da
vergüenza o simplemente quieres hablar de cualquier tontería
aquí vas a encontrar exactamente a la misma persona.`,

`No tengo grandes promesas que ofrecerte. No puedo prometer resolver tus
problemas, hacer que todo salga bien o que la vida sea más fácil. Tampoco sé qué va
a pasar mañana. Pero sí puedo prometerte algo mucho más sencillo: mientras quieras
tenerme en tu vida, voy a seguir ofreciéndote exactamente lo mismo que hoy.`,

`Quien soy.`,

`Sin condiciones, sin tener que fingir y sin esperar que seas alguien diferente.`,

`Y espero que, de alguna manera, eso siempre se sienta un poquito como un hogar.`,

`Feliz cumpleaños, Calabacita.`,

`Con cariño,`,

`Miguel.`,

`No dejes de creer en los aliens`

];

async function writeLetter(){

    const container = document.getElementById("letter-text");

    paragraphs.forEach((text, i) => {

        const p = document.createElement("p");

        p.textContent = text;

        p.style.opacity = "0";
        p.style.transform = "translateY(12px)";
        p.style.transition = `opacity .6s ease ${i * 90}ms, transform .6s ease ${i * 90}ms`;

        container.appendChild(p);

        // forzamos reflow para que la transición arranque desde el estado inicial
        void p.offsetWidth;

        p.style.opacity = "1";
        p.style.transform = "translateY(0)";

    });

}