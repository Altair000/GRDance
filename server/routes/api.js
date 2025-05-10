import express from 'express';
import { pool } from '../db/db.js';
import { getCartItems, addToCart, clearCart, editCartItem, removeCartItem } from '../controllers/cartController.js';
import { getReservations, createReservation } from '../controllers/reservationController.js';

const router = express.Router();

// Obtener todos los servicios
router.get('/services', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, name, price, image_url, description FROM services');
        console.log('Resultados de la consulta:', result.rows); // Depuración
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener los servicios' });
    }
});

// Obtener un servicio por ID
router.get('/services/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query('SELECT id, name, price, image_url, description FROM services WHERE id = $1', [id]);
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Servicio no encontrado' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error al obtener el servicio' });
    }
});

// Obtener los ítems del carrito
router.get('/cart', getCartItems);

// Agregar un servicio al carrito
router.post('/cart', addToCart);

// limpiar el carrito
router.delete('/cart/clear', clearCart);

// Editar un servicio del carrito
router.put('/cart/:service_id', editCartItem);

// Eliminar un servicio del carrito
router.delete('/cart/:service_id', removeCartItem);

// Rutas para reservas
router.get('/reservations', getReservations);
router.post('/reservations', createReservation);

export default router;