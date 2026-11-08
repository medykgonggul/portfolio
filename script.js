/* =========================================================
   FITUR TEMA REAL MADRID
   - progress bar scroll
   - tombol melayang kembali ke atas
   - spotlight hero yang mengikuti mouse
   ========================================================= */
(function () {
    "use strict";

    const kurangiGerak = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    /* ---------- Progress bar & tombol ke atas ---------- */
    const bar = document.createElement("div");
    bar.className = "scroll-progress";
    bar.setAttribute("aria-hidden", "true");
    document.body.appendChild(bar);

    const fab = document.createElement("button");
    fab.type = "button";
    fab.className = "fab-top";
    fab.setAttribute("aria-label", "Kembali ke atas");
    fab.textContent = "↑";
    document.body.appendChild(fab);

    fab.addEventListener("click", function () {
        window.scrollTo({
            top: 0,
            behavior: kurangiGerak ? "auto" : "smooth"
        });
    });

    let menunggu = false;

    function perbarui() {
        const tinggi = document.documentElement.scrollHeight - window.innerHeight;
        const persen = tinggi > 0 ? window.scrollY / tinggi : 0;
        bar.style.transform = "scaleX(" + Math.min(persen, 1) + ")";
        fab.classList.toggle("show", window.scrollY > 400);
        menunggu = false;
    }

    window.addEventListener("scroll", function () {
        if (!menunggu) {
            requestAnimationFrame(perbarui);
            menunggu = true;
        }
    }, { passive: true });

    window.addEventListener("resize", perbarui);
    perbarui();

    /* ---------- Spotlight hero mengikuti mouse (desktop saja) ---------- */
    const hero = document.querySelector(".hero");
    const bisaHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    if (hero && bisaHover && !kurangiGerak) {
        let frame = null;

        hero.addEventListener("pointermove", function (e) {
            if (frame) return;
            frame = requestAnimationFrame(function () {
                const r = hero.getBoundingClientRect();
                hero.style.setProperty("--mx", ((e.clientX - r.left) / r.width * 100) + "%");
                hero.style.setProperty("--my", ((e.clientY - r.top) / r.height * 100) + "%");
                frame = null;
            });
        });
    }
})();
/* =========================================================
   MODAL FORM KONTAK
   ========================================================= */
(function () {
    "use strict";

    const modal = document.getElementById("contactModal");
    const tombolBuka = document.querySelector(".btn-email");
    const tombolTutup = document.getElementById("closeModal");
    const pesanForm = document.getElementById("formMessage");

    if (!modal || !tombolBuka) return;

    let tombolPemicu = null;
    let timerTutup = null;

    function bukaModal(event) {
        event.preventDefault(); // batalkan mailto, buka modal saja
        tombolPemicu = event.currentTarget;
        modal.classList.add("open");
        modal.setAttribute("aria-hidden", "false");
        document.body.classList.add("modal-open");

        setTimeout(function () {
            const inputPertama = document.getElementById("nama");
            if (inputPertama) inputPertama.focus();
        }, 150);
    }

    function tutupModal() {
        clearTimeout(timerTutup);
        modal.classList.remove("open");
        modal.setAttribute("aria-hidden", "true");
        document.body.classList.remove("modal-open");
        if (tombolPemicu) tombolPemicu.focus();
    }

    tombolBuka.addEventListener("click", bukaModal);
    tombolTutup.addEventListener("click", tutupModal);

    // Klik area gelap di luar kotak = tutup
    modal.addEventListener("click", function (event) {
        if (event.target === modal) tutupModal();
    });

    // Tombol Escape = tutup
    document.addEventListener("keydown", function (event) {
        if (event.key === "Escape" && modal.classList.contains("open")) {
            tutupModal();
        }
    });

    // Tutup otomatis 2 detik setelah pesan berhasil terkirim
    if (pesanForm) {
        new MutationObserver(function () {
            if (pesanForm.textContent.indexOf("berhasil") !== -1) {
                timerTutup = setTimeout(tutupModal, 2000);
            }
        }).observe(pesanForm, { childList: true, characterData: true, subtree: true });
    }
})();
console.log("Portfolio berhasil dibuka!");
emailjs.init({
    publicKey: "-SCMK0vyl8vFSSiy5"
});

const elemenReveal = document.querySelectorAll(".reveal");

if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
        function (entries, observer) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add("active");
                    observer.unobserve(entry.target);
                }
            });
        },
        {
            threshold: 0.15
        }
    );

    elemenReveal.forEach(function (elemen) {
        observer.observe(elemen);
    });
} else {
    elemenReveal.forEach(function (elemen) {
        elemen.classList.add("active");
    });
}
const darkModeToggle = document.getElementById("darkModeToggle");

// Ambil tema yang tersimpan
let temaTersimpan = localStorage.getItem("tema");

if (temaTersimpan === "dark") {
    document.body.classList.add("dark-mode");
    darkModeToggle.textContent = "☀️ Light Mode";
}

// Fungsi tombol Dark Mode
darkModeToggle.addEventListener("click", function() {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        localStorage.setItem("tema", "dark");
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        localStorage.setItem("tema", "light");
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});
const contactForm = document.getElementById("contactForm");

if (contactForm) {
    contactForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const nama = document.getElementById("nama").value.trim();
        const email = document.getElementById("email").value.trim();
        const pesan = document.getElementById("pesan").value.trim();
        const formMessage = document.getElementById("formMessage");

        const polaEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (nama === "" || email === "" || pesan === "") {
            formMessage.textContent = "Semua kolom wajib diisi!";
            formMessage.style.color = "red";
            return;
        }

        if (!polaEmail.test(email)) {
            formMessage.textContent = "Format email tidak valid!";
            formMessage.style.color = "red";
            return;
        }

        formMessage.textContent = "Sedang mengirim pesan...";
        formMessage.style.color = "blue";

        emailjs.send(
            "service_mwmv9f9",
            "template_f8e9u38",
            {
                name: nama,
                email: email,
                message: pesan
            }
        ).then(function() {
            formMessage.textContent = "Pesan berhasil dikirim!";
            formMessage.style.color = "green";
            contactForm.reset();
        }).catch(function(error) {
            console.error("EmailJS Error:", error);
            formMessage.textContent = "Pesan gagal dikirim. Silakan coba lagi.";
            formMessage.style.color = "red";
        });
    });
}