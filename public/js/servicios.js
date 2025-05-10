import { updateCartCount } from './cart.js';

document.addEventListener('DOMContentLoaded', async () => {
    const servicesList = document.getElementById('services-list');

    try {
        const response = await fetch('/api/services');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const services = await response.json();

        console.log('Datos recibidos de la API:', services); // Depuración

        if (!Array.isArray(services)) {
            throw new Error('Los datos devueltos no son un array');
        }

        services.forEach(service => {
            if (!service || typeof service !== 'object') {
                console.warn('Servicio inválido encontrado:', service);
                return;
            }
            const price = service.price !== undefined ? parseFloat(service.price).toFixed(2) : '0.00';
            const serviceItem = document.createElement('div');
            serviceItem.classList.add('service-item');
            serviceItem.innerHTML = `
                <a href="/detalle-servicio?id=${service.id}">
                    <img src="${service.image_url || '/images/default.jpg'}" alt="${service.name || 'Servicio'}">
                    <h3>${service.name || 'Sin nombre'}</h3>
                    <p>$${price}</p>
                </a>
            `;
            servicesList.appendChild(serviceItem);
        });

        await updateCartCount(); // Actualizar el contador al cargar la página
    } catch (err) {
        console.error('Error al cargar los servicios:', err);
        servicesList.innerHTML = `<p>Error al cargar los servicios: ${err.message}</p>`;
    }
});