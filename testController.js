/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de frases       
 *: Archivo       : testController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 03/11/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar las respuestas de los test
 *: Ult.Modif.    : 03/11/2024
 *: Modificación: creacion del controladro para manejar las respuestas de los test
 *:======================================================================================================
 */
const express = require('express');
const router = express.Router();
const db = require('./db'); // Conexión a la base de datos

// Guardar puntaje en la tabla `test` para tests semanales
router.post('/guardar-puntaje', async (req, res) => {
    const { userId, puntaje, fechaTest } = req.body;

    console.log('Datos recibidos:', { userId, puntaje });

    if (!userId || !puntaje) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: userId y puntaje' });
    }

    if (puntaje < 1 || puntaje > 5) {
        return res.status(400).json({ error: 'Puntaje inválido. Debe estar entre 1 y 5.' });
    }

    try {
        const result = await db.query(
            'INSERT INTO test (id_usuario, puntaje, fecha_test) VALUES (?, ?, ?)',
            [userId, puntaje, fechaTest || new Date()]
        );

        res.status(201).json({
            message: 'Puntaje del test semanal guardado exitosamente',
            testId: result.insertId
        });
    } catch (error) {
        console.error('Error al guardar el puntaje del test:', error);
        res.status(500).json({ error: 'Error al guardar el puntaje del test' });
    }
});

// Actualizar o registrar la fecha del test diario
router.put('/test-diario/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Actualizar o insertar la fecha del test diario para el usuario
        const result = await db.query(
            'INSERT INTO testDiario (id_usuario, fechaTestDiario) VALUES (?, ?) ' +
            'ON DUPLICATE KEY UPDATE fechaTestDiario = VALUES(fechaTestDiario)',
            [userId, new Date()]
        );

        res.status(200).json({
            message: 'Fecha del test diario actualizada correctamente.'
        });
    } catch (error) {
        console.error('Error al actualizar la fecha del test diario:', error);
        res.status(500).json({ error: 'Error al actualizar la fecha del test diario.' });
    }
});

// Obtener todos los resultados de los tests realizados por un usuario
router.get('/resultados-test/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [results] = await db.query(
            'SELECT id_test, puntaje, DATE_FORMAT(fecha_test, "%Y-%m-%d %H:%i:%s") AS fecha_test FROM test WHERE id_usuario = ? ORDER BY fecha_test DESC',
            [userId]
        );

        if (results.length > 0) {
            res.json(results);
        } else {
            res.status(404).json({ error: 'No se encontraron resultados de test para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener los resultados de los tests:', error);
        res.status(500).json({ error: 'Error al obtener los resultados de los tests.' });
    }
});

// Obtener la fecha del test diario por id_usuario
router.get('/test-diario/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        // Consulta para obtener la fecha del test diario para un usuario específico
        const [results] = await db.query(
            'SELECT DATE_FORMAT(fechaTestDiario, "%Y-%m-%d %H:%i:%s") AS fechaTestDiario ' +
            'FROM testDiario WHERE id_usuario = ?',
            [userId]
        );

        if (results.length > 0) {
            res.json({ fechaTestDiario: results[0].fechaTestDiario });
        } else {
            res.status(404).json({ error: 'No se encontró un registro de test diario para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener la fecha del test diario:', error);
        res.status(500).json({ error: 'Error al obtener la fecha del test diario.' });
    }
});



module.exports = router;
