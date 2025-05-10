export function initCart() {
    updateCartCount();
    window.mostrarCarrito = mostrarCarrito; // Exponer mostrarCarrito globalmente
    window.clearCart = clearCart;
    window.editCartItem = editCartItem;
    window.removeCartItem = removeCartItem;
}

export async function updateCartCount() {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cartItems = await response.json();
        console.log('Ítems del carrito:', cartItems);
        const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
        const cartCountElement = document.getElementById('cart-count');
        if (cartCountElement) {
            cartCountElement.textContent = totalItems;
        }
    } catch (err) {
        console.error('Error al actualizar el contador del carrito:', err);
    }
}

async function clearCart() {
    try {
        toggleLoadingState(true);
        const response = await fetch('/api/cart/clear', {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await updateCartCount();
        mostrarCarrito();
    } catch (err) {
        console.error('Error al vaciar el carrito:', err);
        alert(`Error al vaciar el carrito: ${err.message}`);
    } finally {
        toggleLoadingState(false);
    }
}

async function editCartItem(serviceId, newQuantity) {
    if (newQuantity < 1) return;
    try {
        toggleLoadingState(true);
        const response = await fetch(`/api/cart/${serviceId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quantity: newQuantity })
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await updateCartCount();
        mostrarCarrito();
    } catch (err) {
        console.error('Error al editar el carrito:', err);
        alert(`Error al editar el carrito: ${err.message}`);
    } finally {
        toggleLoadingState(false);
    }
}

async function removeCartItem(serviceId) {
    try {
        toggleLoadingState(true);
        const response = await fetch(`/api/cart/${serviceId}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        await updateCartCount();
        mostrarCarrito();
    } catch (err) {
        console.error('Error al eliminar el ítem del carrito:', err);
        alert(`Error al eliminar el ítem del carrito: ${err.message}`);
    } finally {
        toggleLoadingState(false);
    }
}

async function mostrarCarrito() {
    try {
        const cartResponse = await fetch('/api/cart');
        if (!cartResponse.ok) {
            throw new Error(`HTTP error! status: ${cartResponse.status}`);
        }
        const cartItems = await cartResponse.json();

        let modal = document.getElementById('cart-modal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'cart-modal';
            modal.className = 'cart-modal';
            document.body.appendChild(modal);
        }

        let content = '<div class="cart-modal-content">';
        content += '<span class="close-cart" onclick="document.getElementById(\'cart-modal\').style.display=\'none\'">×</span>';
        content += '<h2>Carrito de Compras</h2>';

        if (cartItems.length === 0) {
            content += '<p>El carrito está vacío.</p>';
        } else {
            content += '<ul class="cart-items">';
            let total = 0;

            for (const item of cartItems) {
                const serviceResponse = await fetch(`/api/services/${item.service_id}`);
                if (!serviceResponse.ok) {
                    throw new Error(`HTTP error! status: ${serviceResponse.status}`);
                }
                const service = await serviceResponse.json();

                const subtotal = parseFloat(service.price) * item.quantity;
                total += subtotal;

                content += `
                    <li data-service-id="${item.service_id}">
                        <span>${service.name}</span>
                        <span class="quantity-controls">
                            $${parseFloat(service.price).toFixed(2)} x 
                            <button class="decrease-btn" onclick="editCartItem(${item.service_id}, ${item.quantity - 1})">-</button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="increase-btn" onclick="editCartItem(${item.service_id}, ${item.quantity + 1})">+</button>
                            <button class="remove-btn" onclick="removeCartItem(${item.service_id})">×</button>
                            = $${subtotal.toFixed(2)}
                        </span>
                    </li>
                `;
            }

            content += '</ul>';
            content += `<p class="cart-total">Total: $${total.toFixed(2)}</p>`;
            content += '<div class="cart-actions">';
            content += '<button class="clear-cart" onclick="clearCart()">Vaciar Carrito</button>';
            content += '<button class="confirm-cart" id="confirm-cart-btn" onclick="window.location.href=\'/formulario\'">Confirmar</button>';
            content += '</div>';
        }

        content += '</div>';
        modal.innerHTML = content;
        modal.style.display = 'block';
    } catch (err) {
        console.error('Error al mostrar el carrito:', err);
        alert(`Error al mostrar el carrito: ${err.message}`);
    }
}

function toggleLoadingState(isLoading) {
    const confirmBtn = document.getElementById('confirm-cart-btn');
    if (confirmBtn) {
        if (isLoading) {
            confirmBtn.disabled = true;
            confirmBtn.classList.add('loading');
            confirmBtn.innerHTML = 'Confirmar <span class="loading-spinner"></span>';
        } else {
            confirmBtn.disabled = false;
            confirmBtn.classList.remove('loading');
            confirmBtn.innerHTML = 'Confirmar';
        }
    }
}