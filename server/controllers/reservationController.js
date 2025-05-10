import { pool } from '../db/db.js';

// Obtener todas las reservas (para el calendario)
export const getReservations = async (req, res) => {
    try {
        const result = await pool.query('SELECT event_date FROM reservations');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener las reservas:', err);
        res.status(500).json({ error: 'Error al obtener las reservas' });
    }
};

// Crear una nueva reserva
export const createReservation = async (req, res) => {
    const { full_name, id_number, phone, event_address, artist_count, payment_method, currency, event_date, details } = req.body;
    try {
        const result = await pool.query(
            'INSERT INTO reservations (full_name, id_number, phone, event_address, artist_count, payment_method, currency, event_date, details) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *',
            [full_name, id_number, phone, event_address, artist_count, payment_method, currency, event_date, details]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error('Error al crear la reserva:', err);
        res.status(500).json({ error: 'Error al crear la reserva' });
    }
};