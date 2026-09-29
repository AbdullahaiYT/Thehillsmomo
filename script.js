let cart = [];
let totalAmount = 0;
const phoneNo = "919310268055";

// Add to Cart
function addToCart(itemName, price) {
    let existingItem = cart.find(i => i.name === itemName);
    if (existingItem) {
        existingItem.qty += 1;
    } else {
        cart.push({ name: itemName, price: price, qty: 1 });
    }
    updateCartUI();
    if (navigator.vibrate) navigator.vibrate(50);
}

// Update Cart & Modals
function updateCartUI() {
    totalAmount = cart.reduce((sum, item) => sum + (item.price * item.qty), 0);
    let totalItems = cart.reduce((sum, item) => sum + item.qty, 0);

    document.getElementById("total-price").innerText = totalAmount;
    document.getElementById("cart-count").innerText = totalItems;
    document.getElementById("modal-total").innerText = totalAmount;
    document.getElementById("takeaway-total").innerText = totalAmount;

    const bottomCart = document.getElementById("bottomCart");
    bottomCart.style.display = cart.length > 0 ? "flex" : "none";

    let summaryHtml = "";
    cart.forEach(item => {
        summaryHtml += `<p>${item.qty}x ${item.name} - ₹${item.price * item.qty}</p>`;
    });
    
    if (cart.length === 0) {
        summaryHtml = "<p>Cart is empty</p>";
    }
    
    document.getElementById("order-summary").innerHTML = summaryHtml;
    document.getElementById("takeaway-summary").innerHTML = summaryHtml;
}

// Clear Cart
function clearCart() {
    cart = [];
    updateCartUI();
    closeModal('checkoutModal');
    closeModal('takeawayModal');
}

// Modal Toggle Logic
function openModal(modalId) { 
    document.getElementById(modalId).classList.add('active'); 
}
function closeModal(modalId) { 
    document.getElementById(modalId).classList.remove('active'); 
    // Take Away modal ko close karte waqt wapas Form par reset karna
    if(modalId === 'takeawayModal') {
        setTimeout(backToTakeawayForm, 300);
    }
}
function scrollToMenu() { 
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' }); 
}

// WhatsApp Link Generator
function getWhatsAppLink(message) {
    return `https://api.whatsapp.com/send?phone=${phoneNo}&text=${encodeURIComponent(message)}`;
}

// --- NEW: TAKE AWAY LOGIC --- //
function showTakeawayPayment() {
    let name = document.getElementById("takeName").value;
    let phone = document.getElementById("takePhone").value;
    if(!name || !phone) {
        alert("Please enter Name and Phone Number");
        return;
    }
    if(cart.length === 0) {
        alert("Cart is empty");
        return;
    }
    // Hide form, show QR
    document.getElementById("takeaway-form-step").style.display = "none";
    document.getElementById("takeaway-qr-step").style.display = "block";
}

function backToTakeawayForm() {
    document.getElementById("takeaway-qr-step").style.display = "none";
    document.getElementById("takeaway-form-step").style.display = "block";
}

function sendTakeawayToWhatsApp() {
    let name = document.getElementById("takeName").value;
    let phone = document.getElementById("takePhone").value;

    let message = `*🛍️ New Take Away Order!*\n*Name:* ${name}\n*Phone:* ${phone}\n---------------------\n`;
    cart.forEach(item => {
        message += `${item.qty}x ${item.name} - ₹${item.price * item.qty}\n`;
    });
    message += `---------------------\n*Total Amount:* ₹${totalAmount}\n\n_Payment Screenshot Attached_`;

    window.top.location.href = getWhatsAppLink(message); 
    clearCart();
}

// --- DINE-IN ORDER --- //
function sendOrderToWhatsApp() {
    let name = document.getElementById("custName").value;
    let table = document.getElementById("custTable").value;

    if (!name || !table) {
        alert("Please enter Name and Table Number");
        return;
    }
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    let message = `*🍽️ New Dine-In Order!*\n*Name:* ${name}\n*Table No:* ${table}\n---------------------\n`;
    cart.forEach(item => {
        message += `${item.qty}x ${item.name} - ₹${item.price * item.qty}\n`;
    });
    message += `---------------------\n*Total Amount:* ₹${totalAmount}`;

    window.top.location.href = getWhatsAppLink(message); 
    clearCart();
}

// --- CANCEL SENDER --- //
function sendCancelToWhatsApp() {
    let name = document.getElementById("cancelName").value;
    let table = document.getElementById("cancelTable").value;

    if (!name || !table) {
        alert("Please enter Name and Table/Phone No to cancel.");
        return;
    }

    let message = `*❌ Order Cancellation Request*\n*Name:* ${name}\n*Details (Table/Phone):* ${table}\n\nPlease cancel my recent order.`;
    
    window.top.location.href = getWhatsAppLink(message); 
    closeModal('cancelModal');
}

// --- BOOKING SENDER --- //
function sendBookingToWhatsApp() {
    let name = document.getElementById("bookName").value;
    let phone = document.getElementById("bookPhone").value;
    let table = document.getElementById("bookTable").value;
    let guest = document.getElementById("bookGuest").value;
    let date = document.getElementById("bookDate").value;

    if (!name || !phone || !guest || !date) {
        alert("Please fill all necessary details.");
        return;
    }

    let message = `*🪑 Table Booking Request!*\n*Name:* ${name}\n*Phone:* ${phone}\n*Table No:* ${table ? table : 'Any'}\n*Total Guests:* ${guest}\n*Date & Time:* ${date.replace('T', ' ')}`;

    window.top.location.href = getWhatsAppLink(message);
}

// --- REVIEW REDIRECT --- //
function submitReview() {
    let exp = document.getElementById("revExperience").value;
    let food = document.getElementById("revFood").value;
    let behavior = document.getElementById("revBehavior").value;
    
    if(!exp || !food || !behavior) {
        alert("Please select all options before reviewing.");
        return;
    }
    
    let reviewText = `Experience: ${exp}, Food: ${food}, Behavior: ${behavior}`;
    navigator.clipboard.writeText(reviewText).then(() => {
        alert("Your choices are copied! Paste them in Google Reviews.");
        window.open("https://search.google.com/local/writereview?placeid=ChIJN1t_tDeuEmsRUsoyG83frY4", "_top"); 
    });
}
