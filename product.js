
/* =========================================
   ChocoHub - Products Page JavaScript
========================================= */

// Replace this with your WhatsApp number.
// Include country code 91, without + or spaces.
const WHATSAPP_NUMBER = "91XXXXXXXXXX";

// Sample products
const products = [
    {
        id: 1,
        name: "Classic Dark Chocolate",
        category: "dark",
        price: 180,
        description: "Rich homemade dark chocolate.",
        emoji: "🍫"
    },
    {
        id: 2,
        name: "Creamy Milk Chocolate",
        category: "milk",
        price: 150,
        description: "Smooth and creamy milk chocolate.",
        emoji: "🍫"
    },
    {
        id: 3,
        name: "Almond Crunch",
        category: "nuts",
        price: 220,
        description: "Delicious chocolate with crunchy almonds.",
        emoji: "🌰"
    },
    {
        id: 4,
        name: "Hazelnut Chocolate",
        category: "nuts",
        price: 240,
        description: "Homemade chocolate with hazelnuts.",
        emoji: "🍫"
    },
    {
        id: 5,
        name: "White Chocolate",
        category: "white",
        price: 170,
        description: "Sweet and silky white chocolate.",
        emoji: "🤍"
    },
    {
        id: 6,
        name: "Chocolate Truffles",
        category: "gift",
        price: 280,
        description: "Soft chocolate truffles for gifting.",
        emoji: "🍬"
    },
    {
        id: 7,
        name: "Chocolate Gift Box",
        category: "gift",
        price: 450,
        description: "A special assorted chocolate gift box.",
        emoji: "🎁"
    },
    {
        id: 8,
        name: "Caramel Chocolate",
        category: "milk",
        price: 200,
        description: "Sweet chocolate with caramel flavour.",
        emoji: "🍯"
    }
];

// Page elements
const productGrid = document.getElementById("productGrid");
const searchInput = document.getElementById("productSearch");
const filterButtons = document.querySelectorAll("[data-category]");

let selectedCategory = "all";
let cart = JSON.parse(localStorage.getItem("chocohubCart") || "[]");

// Format price in Indian Rupees
function formatPrice(price) {
    return new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
        maximumFractionDigits: 0
    }).format(price);
}

// Display products
function displayProducts() {
    if (!productGrid) return;

    const searchTerm = searchInput
        ? searchInput.value.toLowerCase().trim()
        : "";

    const filteredProducts = products.filter(product => {
        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesSearch =
            product.name.toLowerCase().includes(searchTerm) ||
            product.description.toLowerCase().includes(searchTerm);

        return matchesCategory && matchesSearch;
    });

    if (filteredProducts.length === 0) {
        productGrid.innerHTML = `
            <p class="no-products">
                No chocolates found. Try another search.
            </p>
        `;
        return;
    }

    productGrid.innerHTML = filteredProducts.map(product => `
        <article class="product-card">
            <div class="product-image">
                <span>${product.emoji}</span>
            </div>

            <div class="product-info">
                <p class="product-category">
                    ${product.category}
                </p>

                <h3>${product.name}</h3>

                <p class="product-description">
                    ${product.description}
                </p>

                <div class="product-card-bottom">
                    <strong>${formatPrice(product.price)}</strong>

                    <button
                        class="btn add-to-cart"
                        type="button"
                        data-add="${product.id}">
                        Add to Cart
                    </button>
                </div>
            </div>
        </article>
    `).join("");
}

// Save cart to browser storage
function saveCart() {
    localStorage.setItem("chocohubCart", JSON.stringify(cart));
    updateCart();
}

// Add product to cart
function addToCart(productId) {
    const product = products.find(item => item.id === productId);

    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }

    saveCart();
}

// Change product quantity
function changeQuantity(productId, amount) {
    const item = cart.find(item => item.id === productId);

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {
        cart = cart.filter(item => item.id !== productId);
    }

    saveCart();
}

// Update cart display
function updateCart() {
    const cartItems = document.getElementById("cartItems");
    const cartCount = document.getElementById("cartCount");
    const cartSubtotal = document.getElementById("cartSubtotal");

    const totalItems = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    if (cartCount) {
        cartCount.textContent = totalItems;
    }

    if (cartSubtotal) {
        cartSubtotal.textContent = formatPrice(subtotal);
    }

    if (!cartItems) return;

    if (cart.length === 0) {
        cartItems.innerHTML = `
            <p class="empty-cart">
                Your cart is empty. Add some chocolates!
            </p>
        `;
        return;
    }

    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item">
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <p>${formatPrice(item.price * item.quantity)}</p>
            </div>

            <div class="quantity-controls">
                <button
                    type="button"
                    data-quantity="${item.id}"
                    data-change="-1"
                    aria-label="Decrease quantity">
                    −
                </button>

                <span>${item.quantity}</span>

                <button
                    type="button"
                    data-quantity="${item.id}"
                    data-change="1"
                    aria-label="Increase quantity">
                    +
                </button>
            </div>
        </div>
    `).join("");
}

// Open and close cart drawer
function openCart() {
    document.getElementById("cartDrawer")?.classList.add("open");
    document.getElementById("cartOverlay")?.classList.add("open");
}

function closeCart() {
    document.getElementById("cartDrawer")?.classList.remove("open");
    document.getElementById("cartOverlay")?.classList.remove("open");
}

// Open and close order modal
function openOrderModal() {
    if (cart.length === 0) {
        alert("Please add chocolates to your cart first.");
        return;
    }

    document.getElementById("orderModal")?.classList.add("open");
}

function closeOrderModal() {
    document.getElementById("orderModal")?.classList.remove("open");
}

// Send order details through WhatsApp
function sendWhatsAppOrder(event) {
    event.preventDefault();

    if (cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    if (WHATSAPP_NUMBER.includes("X")) {
        alert("Please add your WhatsApp number in products.js first.");
        return;
    }

    const customerName =
        document.getElementById("customerName")?.value.trim() || "";

    const customerPhone =
        document.getElementById("customerPhone")?.value.trim() || "";

    const customerAddress =
        document.getElementById("customerAddress")?.value.trim() || "";

    const itemsText = cart.map(item =>
        `${item.name} x ${item.quantity} = ${formatPrice(item.price * item.quantity)}`
    ).join("\n");

    const subtotal = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    const message = `Hello ChocoHub! I would like to place an order.

Name: ${customerName}
Phone: ${customerPhone}
Address: ${customerAddress}

Order:
${itemsText}

Total: ${formatPrice(subtotal)}`;

    const whatsappURL =
        `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappURL, "_blank");
}

// Product search
searchInput?.addEventListener("input", displayProducts);

// Category filters
filterButtons.forEach(button => {
    button.addEventListener("click", () => {
        selectedCategory = button.dataset.category;

        filterButtons.forEach(filter => {
            filter.classList.remove("active");
        });

        button.classList.add("active");
        displayProducts();
    });
});

// Handle cart and quantity buttons
document.addEventListener("click", event => {
    const addButton = event.target.closest("[data-add]");

    if (addButton) {
        addToCart(Number(addButton.dataset.add));
        return;
    }

    const quantityButton = event.target.closest("[data-quantity]");

    if (quantityButton) {
        changeQuantity(
            Number(quantityButton.dataset.quantity),
            Number(quantityButton.dataset.change)
        );
    }
});

// Cart controls
document.getElementById("openCart")?.addEventListener("click", openCart);
document.getElementById("closeCart")?.addEventListener("click", closeCart);
document.getElementById("cartOverlay")?.addEventListener("click", closeCart);

// Order modal controls
document.getElementById("checkoutButton")?.addEventListener("click", () => {
    closeCart();
    openOrderModal();
});

document.getElementById("closeOrderModal")?.addEventListener(
    "click",
    closeOrderModal
);

document.getElementById("orderForm")?.addEventListener(
    "submit",
    sendWhatsAppOrder
);

// Mobile navigation
document.getElementById("menuToggle")?.addEventListener("click", () => {
    document.querySelector(".nav-links")?.classList.toggle("active");
});

// Back to top
const backToTop = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
    if (backToTop) {
        backToTop.classList.toggle("show", window.scrollY > 300);
    }
});

backToTop?.addEventListener("click", () => {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
});

// Initial page setup
displayProducts();
updateCart();
