
const menuToggle = document.getElementById("menuToggle");
const navLinks = document.getElementById("navLinks");
const backToTop = document.getElementById("backToTop");
const contactForm = document.getElementById("contactForm");
const customerMessage = document.getElementById("customerMessage");
const formNote = document.getElementById("formNote");

// Mobile navigation
menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.textContent = isOpen ? "✕" : "☰";
});

// Close mobile menu after clicking a link
navLinks.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
        navLinks.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.textContent = "☰";
    });
});

// Product enquiry: prefill the contact message
document.querySelectorAll("[data-product]").forEach(link => {
    link.addEventListener("click", () => {
        const product = link.dataset.product;
        customerMessage.value = `Hello ChocoHub! I would like to enquire about ${product}.`;
    });
});

// Footer year
document.getElementById("year").textContent = new Date().getFullYear();

// Back-to-top button
window.addEventListener("scroll", () => {
    backToTop.classList.toggle("visible", window.scrollY > 350);
});

backToTop.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Contact form demo
contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.getElementById("customerName").value.trim();

    formNote.textContent =
        `Thank you, ${name}! Your message is ready, but this demo form does not send it yet.`;

    // A real submission requires a backend or form service.
});
