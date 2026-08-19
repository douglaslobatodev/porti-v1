const EMAILJS_PUBLIC_KEY = "a17fs3rq5KK9E-4OB";
const EMAILJS_SERVICE_ID = "service_ewjth6r";
const EMAILJS_TEMPLATE_ID = "template_xtkq6xs";

if (typeof emailjs !== "undefined") {
emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY });
}

document.addEventListener("DOMContentLoaded", () => {
const navToggle = document.querySelector(".nav-toggle");
const primaryNav = document.getElementById("primary-nav");
const navLinks = document.querySelectorAll('.ul-list a[href^="#"]');
const navItems = document.querySelectorAll(".ul-list li");
const sections = document.querySelectorAll("main section[id]");

initScrollAnimations();
updateActiveMenu();

// ===============================
// 0. MENU MOBILE (HAMBÚRGUER)
// ===============================
function closeMobileMenu() {
if (!navToggle || !primaryNav) return;
primaryNav.classList.remove("open");
navToggle.classList.remove("is-active");
navToggle.setAttribute("aria-expanded", "false");
document.body.classList.remove("nav-open");
}

function openMobileMenu() {
if (!navToggle || !primaryNav) return;
primaryNav.classList.add("open");
navToggle.classList.add("is-active");
navToggle.setAttribute("aria-expanded", "true");
document.body.classList.add("nav-open");
}

if (navToggle && primaryNav) {
navToggle.addEventListener("click", () => {
if (primaryNav.classList.contains("open")) {
closeMobileMenu();
} else {
openMobileMenu();
}
});

document.addEventListener("keydown", (e) => {
if (e.key === "Escape" && primaryNav.classList.contains("open")) {
closeMobileMenu();
navToggle.focus();
}
});

document.addEventListener("click", (e) => {
if (!primaryNav.classList.contains("open")) return;
if (primaryNav.contains(e.target) || navToggle.contains(e.target)) return;
closeMobileMenu();
});
}

// ===============================
// 1. SCROLL SUAVE
// ===============================
function scrollToSection(targetSelector) {
const target = document.querySelector(targetSelector);
if (!target) return;

if (target.classList.contains("reveal")) {
target.classList.add("active");
}

const headerOffset = 100;
const elementPosition = target.getBoundingClientRect().top + window.pageYOffset;
const offsetPosition = elementPosition - headerOffset;

window.scrollTo({
top: offsetPosition,
behavior: "smooth",
});
}

navLinks.forEach((anchor) => {
anchor.addEventListener("click", function (e) {
e.preventDefault();

const targetSelector = this.getAttribute("href");
closeMobileMenu();
if (!targetSelector) return;

scrollToSection(targetSelector);
});
});

// ===============================
// 2. MENU ATIVO NO SCROLL
// ===============================
function updateActiveMenu() {
let currentSectionId = "";

const scrollPosition = window.scrollY + 140;

sections.forEach((section) => {
const sectionTop = section.offsetTop;
const sectionHeight = section.offsetHeight;

if (
scrollPosition >= sectionTop &&
scrollPosition < sectionTop + sectionHeight
) {
currentSectionId = section.getAttribute("id");
}
});

navItems.forEach((item) => {
item.classList.remove("active");
const link = item.querySelector("a");
if (!link) return;

const href = link.getAttribute("href");
if (href === `#${currentSectionId}`) {
item.classList.add("active");
}
});
}

window.addEventListener("scroll", updateActiveMenu);
window.addEventListener("load", updateActiveMenu);
window.addEventListener("resize", updateActiveMenu);

// ===============================
// 3. FORMULÁRIO DE CONTATO
// ===============================
const contactForm = document.getElementById("contact-form");
const formStatus = document.getElementById("form-status");

if (contactForm) {
const submitBtn = contactForm.querySelector('button[type="submit"]');

contactForm.addEventListener("submit", (e) => {
e.preventDefault();

const name = contactForm.user_name.value.trim();
const email = contactForm.user_email.value.trim();
const message = contactForm.message.value.trim();

const subject = `Contato via portfólio - ${name}`;
const mailtoBody = `Nome: ${name}\nE-mail: ${email}\n\n${message}`;
const mailtoLink = `mailto:douglaslobato1803@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(mailtoBody)}`;

const fallbackToMailto = () => {
window.location.href = mailtoLink;
if (formStatus) {
formStatus.textContent = "Não foi possível enviar direto. Abrindo seu aplicativo de e-mail...";
}
};

if (typeof emailjs === "undefined") {
fallbackToMailto();
return;
}

if (submitBtn) submitBtn.disabled = true;
if (formStatus) formStatus.textContent = "Enviando mensagem...";

emailjs
.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
name,
email,
message,
title: subject,
time: new Date().toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" }),
})
.then(() => {
if (formStatus) formStatus.textContent = "Mensagem enviada com sucesso! Retorno em breve.";
contactForm.reset();
})
.catch((err) => {
console.error("EmailJS error:", err);
fallbackToMailto();
})
.finally(() => {
if (submitBtn) submitBtn.disabled = false;
});
});
}

// ===============================
// 4. REVEAL AO ROLAR
// ===============================
function initScrollAnimations() {
const revealElements = document.querySelectorAll(".reveal");

if (!revealElements.length) return;

if (!("IntersectionObserver" in window)) {
revealElements.forEach((el) => el.classList.add("active"));
return;
}

const revealObserver = new IntersectionObserver(
(entries, observer) => {
entries.forEach((entry) => {
if (!entry.isIntersecting) return;

entry.target.classList.add("active");
observer.unobserve(entry.target);
});
},
{
threshold: 0.12,
rootMargin: "0px 0px -40px 0px",
}
);

revealElements.forEach((el) => revealObserver.observe(el));
}
});
