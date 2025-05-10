import { updateCartCount } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    await updateCartCount();
    await loadCartSummary();

    let reservedDates = [];
    try {
        const response = await fetch('/api/reservations');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const reservations = await response.json();
        reservedDates = reservations.map(res => new Date(res.event_date).toISOString().split('T')[0]);
    } catch (err) {
        console.error('Error al cargar fechas reservadas:', err);
    }

    $("#event-date").datepicker({
        dateFormat: 'yy-mm-dd',
        minDate: 0,
        beforeShowDay: function(date) {
            const dateString = $.datepicker.formatDate('yy-mm-dd', date);
            if (reservedDates.includes(dateString)) {
                return [false, 'reserved-date', 'Fecha no disponible'];
            }
            return [true, 'available-date', 'Fecha disponible'];
        }
    });

    document.getElementById('reservation-form').addEventListener('submit', async (e) => {
        e.preventDefault();

        // Validar campos requeridos
        const requiredFields = [
            'full-name',
            'id-number',
            'phone',
            'event-address',
            'artist-count',
            'payment-method',
            'currency',
            'event-date'
        ];
        let isValid = true;
        requiredFields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (!field.value.trim()) {
                isValid = false;
                field.style.borderColor = 'red';
            } else {
                field.style.borderColor = '';
            }
        });

        if (!isValid) {
            alert('Por favor, rellene todos los campos requeridos.');
            return;
        }

        const formData = {
            full_name: document.getElementById('full-name').value,
            id_number: document.getElementById('id-number').value,
            phone: document.getElementById('phone').value,
            event_address: document.getElementById('event-address').value,
            artist_count: parseInt(document.getElementById('artist-count').value),
            payment_method: document.getElementById('payment-method').value,
            currency: document.getElementById('currency').value,
            event_date: document.getElementById('event-date').value,
            details: document.getElementById('details').value
        };

        try {
            const response = await fetch('/api/reservations', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            // Vaciar el carrito después de confirmar la reserva
            await fetch('/api/cart/clear', { method: 'DELETE' });
            await updateCartCount();

            // Redirigir a WhatsApp con mensaje predefinido
            const whatsappMessage = encodeURIComponent(`
                Nueva reserva:
                Nombre: ${formData.full_name}
                Carnet: ${formData.id_number}
                Teléfono: ${formData.phone}
                Dirección: ${formData.event_address}
                Artistas: ${formData.artist_count}
                Método de Pago: ${formData.payment_method}
                Moneda: ${formData.currency}
                Fecha: ${formData.event_date}
                Detalles: ${formData.details || 'No especificados'}
            `);
            const whatsappUrl = `https://wa.me/+5353506760?text=${whatsappMessage}`;
            window.location.href = whatsappUrl;
        } catch (err) {
            console.error('Error al confirmar la reserva:', err);
            alert(`Error al confirmar la reserva: ${err.message}`);
        }
    });
});

async function loadCartSummary() {
    try {
        const response = await fetch('/api/cart');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const cartItems = await response.json();
        const cartItemsSummary = document.getElementById('cart-items-summary');
        const cartTotalSummary = document.getElementById('cart-total-summary');

        if (cartItems.length === 0) {
            cartItemsSummary.innerHTML = '<li>El carrito está vacío.</li>';
            cartTotalSummary.textContent = 'Total: $0.00';
            return;
        }

        let total = 0;
        cartItemsSummary.innerHTML = '';

        for (const item of cartItems) {
            const serviceResponse = await fetch(`/api/services/${item.service_id}`);
            if (!serviceResponse.ok) {
                throw new Error(`HTTP error! status: ${serviceResponse.status}`);
            }
            const service = await serviceResponse.json();

            const subtotal = parseFloat(service.price) * item.quantity;
            total += subtotal;

            cartItemsSummary.innerHTML += `
                <li>
                    <span>${service.name} x ${item.quantity}</span>
                    <span>$${subtotal.toFixed(2)}</span>
                </li>
            `;
        }

        cartTotalSummary.textContent = `Total: $${total.toFixed(2)}`;
    } catch (err) {
        console.error('Error al cargar el resumen del carrito:', err);
        document.getElementById('cart-items-summary').innerHTML = '<li>Error al cargar el resumen.</li>';
        document.getElementById('cart-total-summary').textContent = 'Total: $0.00';
    }
}