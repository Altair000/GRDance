import { pool } from '../db/db.js';

// Obtener los ítems del carrito
export const getCartItems = async (req, res) => {
    try {
        const result = await pool.query('SELECT * FROM cart_items');
        console.log('Ítems devueltos por /api/cart:', result.rows);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener el carrito:', err);
        res.status(500).json({ error: 'Error al obtener el carrito' });
    }
};

// Agregar un servicio al carrito
export const addToCart = async (req, res) => {
    const { service_id } = req.body;
    if (!service_id) {
        return res.status(400).json({ error: 'Falta el service_id' });
    }
    try {
        const result = await pool.query(
            'INSERT INTO cart_items (service_id, quantity) VALUES ($1, 1) ON CONFLICT (service_id) DO UPDATE SET quantity = cart_items.quantity + 1 RETURNING *',
            [service_id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al agregar al carrito:', err);
        res.status(500).json({ error: 'Error al agregar al carrito' });
    }
};

// Vaciar el carrito
export const clearCart = async (req, res) => {
    try {
        await pool.query('DELETE FROM cart_items');
        res.json({ message: 'Carrito vaciado exitosamente' });
    } catch (err) {
        console.error('Error al vaciar el carrito:', err);
        res.status(500).json({ error: 'Error al vaciar el carrito' });
    }
};

// Editar la cantidad de un ítem en el carrito
export const editCartItem = async (req, res) => {
    const { service_id } = req.params;
    const { quantity } = req.body;
    if (!quantity || quantity < 1) {
        return res.status(400).json({ error: 'Cantidad inválida' });
    }
    try {
        const result = await pool.query(
            'UPDATE cart_items SET quantity = $1 WHERE service_id = $2 RETURNING *',
            [quantity, service_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado en el carrito' });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al editar el carrito:', err);
        res.status(500).json({ error: 'Error al editar el carrito' });
    }
};

// Eliminar un ítem del carrito
export const removeCartItem = async (req, res) => {
    const { service_id } = req.params;
    try {
        const result = await pool.query(
            'DELETE FROM cart_items WHERE service_id = $1 RETURNING *',
            [service_id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ error: 'Ítem no encontrado en el carrito' });
        }
        res.json({ message: 'Ítem eliminado exitosamente' });
    } catch (err) {
        console.error('Error al eliminar el ítem del carrito:', err);
        res.status(500).json({ error: 'Error al eliminar el ítem del carrito' });
    }
};