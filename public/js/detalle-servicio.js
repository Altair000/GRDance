import { updateCartCount } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    await updateCartCount(); // Actualizar el contador al cargar la página

    const urlParams = new URLSearchParams(window.location.search);
    const serviceId = urlParams.get('id');

    if (!serviceId) {
        document.querySelector('.service-detail').innerHTML = '<p>Servicio no encontrado.</p>';
        return;
    }

    try {
        const response = await fetch(`/api/services/${serviceId}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const service = await response.json();

        if (!service) {
            document.querySelector('.service-detail').innerHTML = '<p>Servicio no encontrado.</p>';
            return;
        }

        document.getElementById('service-name').textContent = service.name || 'Sin nombre';
        document.getElementById('service-price').textContent = `$${service.price !== undefined ? parseFloat(service.price).toFixed(2) : '0.00'}`;
        document.getElementById('service-details').textContent = service.description || 'Sin detalles';

        document.getElementById('add-to-cart').addEventListener('click', async () => {
            try {
                const cartResponse = await fetch('/api/cart', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ service_id: serviceId })
                });
                if (!cartResponse.ok) {
                    const errorData = await cartResponse.json();
                    throw new Error(errorData.error || 'Error al agregar al carrito');
                }
                await updateCartCount(); // Actualizar el contador después de agregar
                window.location.href = '/servicios';
            } catch (err) {
                console.error('Error al agregar al carrito:', err);
                alert(`Error al agregar al carrito: ${err.message}`);
            }
        });
    } catch (err) {
        console.error('Error al cargar el servicio:', err);
        document.querySelector('.service-detail').innerHTML = `<p>Error al cargar el servicio: ${err.message}</p>`;
    }
});