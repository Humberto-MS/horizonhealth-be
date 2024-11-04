/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de ejercicio       
 *: Archivo       : ejercicioController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `ejercicio` y `ejercicioPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

const express = require('express');
const router = express.Router();
const db = require('./db');  // Conexión a la base de datos

// Obtener un ejercicio estándar aleatorio
router.get('/ejercicios', async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM ejercicio ORDER BY RAND() LIMIT 1');
        res.json(rows[0] || { error: 'No se encontraron ejercicios' });
    } catch (error) {
        console.error('Error al obtener ejercicio estándar:', error);
        res.status(500).json({ error: 'Error al obtener ejercicio' });
    }
});

// Obtener un ejercicio premium aleatorio (solo para usuarios premium)
router.get('/ejercicios/premium', async (req, res) => {
    const { userId } = req.query;

    try {
        const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);

        if (user.length > 0 && user[0].premium) {
            const [rows] = await db.query('SELECT * FROM ejercicioPremium WHERE id_usuario = ? ORDER BY RAND() LIMIT 1', [userId]);
            res.json(rows[0] || { error: 'No se encontraron ejercicios premium' });
        } else {
            res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
        }
    } catch (error) {
        console.error('Error al obtener ejercicio premium:', error);
        res.status(500).json({ error: 'Error al obtener ejercicios premium' });
    }
});

module.exports = router;
