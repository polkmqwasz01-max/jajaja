// =======================
// Smooth Scroll (EXCEPT GAME)
// =======================
document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener("click", e => {
        const href = a.getAttribute("href");
        if (href === "#loan-escape") return; // ⛔ skip game
        e.preventDefault();
        const target = document.querySelector(href);
        if (target) target.scrollIntoView({ behavior: "smooth" });
    });
});


// =======================
// Navbar scroll effect
// =======================
window.addEventListener("scroll", () => {
    const navbar = document.querySelector(".navbar");
    if (navbar) {
        navbar.classList.toggle("scrolled", window.scrollY > 20);
    }
});


// =======================
// Section Observer (EXCLUDE GAME)
// =======================
const sections = document.querySelectorAll('section:not(#loan-escape)');

const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('active');
        } else {
            entry.target.classList.remove('active');
        }
    });
}, { threshold: 0.6 });

sections.forEach(section => sectionObserver.observe(section));

// =======================
// Counter
// =======================
const counters = document.querySelectorAll(".counter");
const counterStart = new WeakSet();

function runCounter(counter) {
    const max = +counter.dataset.count;
    let now = 0;
    const timer = setInterval(() => {
        counter.textContent = ++now;
        if (now >= max) clearInterval(timer);
    }, 120);
}

window.addEventListener("scroll", () => {
    counters.forEach(counter => {
        if (!counterStart.has(counter) &&
            counter.getBoundingClientRect().top < window.innerHeight) {
            counterStart.add(counter);
            runCounter(counter);
        }
    });
});


// =======================
// Project Modal
// // =======================
// const projects = {
//     1: {
//         title: "Smart Switch IoT",
//         img: "imtest/project1.png",
//         description: "Proyek otomatisasi perangkat rumah berbasis IoT..."
//     },
//     2: {
//         title: "Avoider Robotic",
//         img: "imtest/project2.png",
//         description: "Robot penghindar rintangan dengan sensor ultrasonik..."
//     },
//     3: {
//         title: "Measure Distance",
//         img: "imtest/project3.png",
//         description: "Alat pengukur jarak dengan akurasi tinggi menggunakan sensor digital..."
//     }
// };

// const modal = document.getElementById("project-modal");
// const modalTitle = document.getElementById("modal-title");
// const modalImg = document.getElementById("modal-image");
// const modalDesc = document.getElementById("modal-description");
// const modalClose = document.querySelector(".modal-close");

// document.querySelectorAll(".project-card").forEach(card => {
//     card.addEventListener("click", () => {
//         const id = card.dataset.project;
//         if (projects[id]) {
//             modalTitle.textContent = projects[id].title;
//             modalImg.src = projects[id].img;
//             modalDesc.textContent = projects[id].description;
//             modal.style.display = "flex";
//         }
//     });
// });

// if (modalClose) modalClose.onclick = () => modal.style.display = "none";
// window.addEventListener("click", e => {
//     if (e.target === modal) modal.style.display = "none";
// });


// =======================
// Skill Animation
// =======================
const modernSkills = document.querySelectorAll('.modern-skill');

const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;

        const skill = entry.target;
        const fill = skill.querySelector('.fill');
        const percentEl = skill.querySelector('.percent');
        const targetPercent = parseInt(skill.dataset.percentage);

        if (fill) fill.style.transform = `rotate(${targetPercent * 3.6}deg)`;

        if (percentEl) {
            let count = 0;
            const interval = setInterval(() => {
                count++;
                percentEl.textContent = count + "%";
                if (count >= targetPercent) clearInterval(interval);
            }, 20);
        }

        skillObserver.unobserve(skill);
    });
}, { threshold: 0.5 });

modernSkills.forEach(skill => skillObserver.observe(skill));


// =======================
// LOAN ESCAPE GAME (HIDDEN SAFE)
// =======================
let saldo = 1000;
let hutang = 5000;
let periode = 1;
let maxPeriode = 12;
let cicilan = 500;
let bungaHutang = 0.05;
let investRate = 0.10;

const gameSection = document.getElementById("loan-escape");
const elSaldo = document.getElementById("saldo");
const elHutang = document.getElementById("hutang");
const elPeriode = document.getElementById("periode");
const elInvestRate = document.getElementById("investRate");
const logGame = document.getElementById("log");

const btnBayar = document.getElementById("btnBayar");
const btnInvest = document.getElementById("btnInvest");
const btnUpgrade = document.getElementById("btnUpgrade");
const btnMini = document.getElementById("btnMini");

if (gameSection) gameSection.classList.add("hidden");

function updateGame(){
    if(!elSaldo) return;
    elSaldo.textContent = Math.floor(saldo);
    elHutang.textContent = Math.floor(hutang);
    elPeriode.textContent = periode;
    elInvestRate.textContent = Math.floor(investRate * 100) + "%";
}

function addLogGame(text){
    logGame.innerHTML += text + "<br>";
    logGame.scrollTop = logGame.scrollHeight;
}

function randomEvent(){
    const r = Math.random();
    if(r < 0.25) saldo += 300;
    else if(r > 0.8) saldo -= 250;
}

function nextTurn(){
    hutang *= (1 + bungaHutang);
    periode++;
    randomEvent();

    if (hutang <= 0) endGame("🎉 debt free!");
    else if (saldo < 0) endGame("💀 bankrupt!");
    else if (periode > maxPeriode) endGame("⏰ time out!");

    updateGame();
}

function endGame(msg){
    addLogGame(msg);
    gameSection.querySelectorAll("button").forEach(b => b.disabled = true);
}

btnBayar.onclick = () => {
    saldo -= cicilan;
    hutang -= cicilan;
    addLogGame("💸 pay installments");
    nextTurn();
};

btnInvest.onclick = () => {
    const modal = saldo * 0.4;
    saldo += modal * investRate;
    saldo -= modal;
    addLogGame("📈 Investasi success");
    nextTurn();
};

btnUpgrade.onclick = () => {
    if (saldo < 300) return addLogGame("❌ balance is low");
    saldo -= 300;
    investRate += 0.03;
    updateGame();
};

btnMini.onclick = () => {
    const type = Math.floor(Math.random() * 5) + 1;

    // =======================================================
    // 1. RANDOM MATRIX (A + B)
    // =======================================================
    if (type === 1) {
        const A = [
            [Math.floor(Math.random()*10), Math.floor(Math.random()*10)],
            [Math.floor(Math.random()*10), Math.floor(Math.random()*10)]
        ];
        const B = [
            [Math.floor(Math.random()*10), Math.floor(Math.random()*10)],
            [Math.floor(Math.random()*10), Math.floor(Math.random()*10)]
        ];

        const row = Math.floor(Math.random()*2);
        const col = Math.floor(Math.random()*2);

        const correct = A[row][col] + B[row][col];

        const jawab = prompt(
            `Matrix addition:\n` +
            `A = [${A[0]} , ${A[1]}]\n` +
            `B = [${B[0]} , ${B[1]}]\n\n` +
            `What is (A+B) at row ${row+1}, column ${col+1}?`
        );

        if (+jawab === correct) saldo += 400;
        else saldo -= 200;

        return updateGame();
    }


    // =======================================================
    // 2. RANDOM BUNGA MAJEMUK
    // =======================================================
    if (type === 2) {
        const P = (Math.floor(Math.random()*9)+1) * 100;   // 100 – 900
        const r = (Math.floor(Math.random()*10)+1) / 100;  // 1% – 10%
        const t = Math.floor(Math.random()*5) + 1;         // 1 – 5 periode

        const A = Math.floor(P * Math.pow(1 + r, t));

        const jawab = prompt(
            `Compound interest:\n` +
            `Principal: ${P}\n` +
            `Rate: ${(r*100).toFixed(0)}%\n` +
            `Time: ${t} periods\n\n` +
            `Total amount after ${t} periods?`
        );

        if (+jawab === A) saldo += 400;
        else saldo -= 200;

        return updateGame();
    }


    // =======================================================
    // 3. PROCEDURE TEXT: "BUILDING A WEBSITE"
    // =======================================================
    if (type === 3) {

        const steps = [
            "Choose a domain name",
            "Create the website layout",
            "Write the page content",
            "Publish the website online",
            "Install a template",
            "Set up hosting"
        ];

        // ambil 3 langkah random untuk pertanyaan
        const pick = () => steps[Math.floor(Math.random() * steps.length)];
        const randomSteps = [pick(), pick(), pick()];

        // tentukan mana yang harusnya paling pertama (logika prosedur)
        const order = [
            "Choose a domain name",
            "Set up hosting",
            "Install a template",
            "Create the website layout",
            "Write the page content",
            "Publish the website online"
        ];

        // cari langkah dengan ranking terendah (paling awal)
        let correct = randomSteps[0];
        for (let step of randomSteps) {
            if (order.indexOf(step) < order.indexOf(correct)) correct = step;
        }

        // tampilkan langkah dengan urutan acak
        const displayed = [...randomSteps].sort(() => Math.random() - 0.5);

        const jawab = prompt(
            `Procedure Text: Building a Website\n` +
            `Which step should come FIRST?\n\n` +
            `Steps:\n- ${displayed[0]}\n- ${displayed[1]}\n- ${displayed[2]}\n\n` +
            `Type the exact step:`
        );

        if (jawab && jawab.toLowerCase().trim() === correct.toLowerCase()) 
            saldo += 400;
        else 
            saldo -= 200;

        return updateGame();
    }


    // =======================================================
    // 4. ARITMATIKA (RANDOM)
    // =======================================================
    if (type === 4) {
        const a = Math.floor(Math.random()*20)+1;
        const b = Math.floor(Math.random()*20)+1;

        const ops = ["+", "-", "*"];
        const op = ops[Math.floor(Math.random()*ops.length)];

        let correct;
        if (op === "+") correct = a + b;
        if (op === "-") correct = a - b;
        if (op === "*") correct = a * b;

        const jawab = prompt(`Aritmatika:\n\nBerapa hasil dari: ${a} ${op} ${b} ?`);

        if (+jawab === correct) saldo += 400;
        else saldo -= 200;

        return updateGame();
    }


    // =======================================================
    // 5. GEOMETRI (RANDOM)
    // =======================================================
    if (type === 5) {

        const bentuk = Math.floor(Math.random()*3); // 0 = persegi, 1 = segitiga, 2 = lingkaran

        // PERSEGI (luas = s^2)
        if (bentuk === 0) {
            const s = Math.floor(Math.random()*15)+1;
            const correct = s * s;
            const jawab = prompt(`Geometri:\nHitung luas persegi dengan sisi ${s}`);
            if (+jawab === correct) saldo += 400; else saldo -= 200;
            return updateGame();
        }

        // SEGITIGA (luas = 1/2 a t)
        if (bentuk === 1) {
            const a = Math.floor(Math.random()*15)+1;
            const t = Math.floor(Math.random()*15)+1;
            const correct = Math.floor((a * t) / 2);
            const jawab = prompt(`Geometri:\nHitung luas segitiga dengan alas ${a} dan tinggi ${t}`);
            if (+jawab === correct) saldo += 400; else saldo -= 200;
            return updateGame();
        }

        // LINGKARAN (luas = πr², pakai 3.14)
        if (bentuk === 2) {
            const r = Math.floor(Math.random()*10)+1;
            const correct = Math.floor(3.14 * r * r);
            const jawab = prompt(`Geometri:\nHitung luas lingkaran dengan jari-jari ${r}\n( gunakan π = 3.14 )`);
            if (+jawab === correct) saldo += 400; else saldo -= 200;
            return updateGame();
        }
    }
};

// =======================
// NAV GAME OPEN
// =======================
const navGame = document.getElementById("nav-game");

if(navGame && gameSection){
    navGame.addEventListener("click", e => {
    e.preventDefault();

    // sembunyikan efek section lain
    document.querySelectorAll("section").forEach(sec => {
        sec.classList.remove("active");
    });

    // tampilkan game
    gameSection.classList.remove("hidden");
    gameSection.classList.add("active"); // ✅ PENTING

    setTimeout(() => {
        gameSection.scrollIntoView({ behavior: "smooth" });
    }, 100);
});

}
// =======================
// INIT GAME
// =======================
updateGame();
addLogGame("🎯 Target: pay off debt!");


// =======================
// Chat
// =======================
const chatForm = document.getElementById("chat-form");
const chatInput = document.getElementById("chat-input");
const chatMessages = document.querySelector(".chat-messages");

if(chatForm && chatInput && chatMessages){
    chatForm.addEventListener("submit", e => {
        e.preventDefault();
        const msg = chatInput.value.trim();
        if(!msg) return;

        chatMessages.innerHTML += `<p> ${msg}</p>`;
        chatMessages.innerHTML += `<p>Maaf 🙏🙏, Saya tidak mengerti..</p>`;
        chatInput.value = "";
        chatMessages.scrollTop = chatMessages.scrollHeight;
    });
}


// =======================
// Contact Form
// =======================
const contactForm = document.getElementById("contactForm");
const formMsg = document.getElementById("formMsg");

if(contactForm){
    contactForm.addEventListener("submit", e => {
        e.preventDefault();
        formMsg.textContent = "Pesan terkirim!";
        contactForm.reset();
    });
}


