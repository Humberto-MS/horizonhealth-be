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

// Guardar solo la fecha y hora del test diario en la tabla `testDiario`
router.post('/guardar-test-diario', async (req, res) => {
    const { userId } = req.body;

    if (!userId) {
        return res.status(400).json({ error: 'Falta el id del usuario (userId).' });
    }

    try {
        const currentDateTime = new Date();
        const result = await db.query(
            'INSERT INTO testDiario (id_usuario, fechaTestDiario) VALUES (?, ?)',
            [userId, currentDateTime]
        );

        res.status(201).json({
            message: 'Registro del test diario guardado exitosamente',
            fechaTestDiario: currentDateTime,
            testDiarioId: result.insertId
        });
    } catch (error) {
        console.error('Error al guardar el registro del test diario:', error);
        res.status(500).json({ error: 'Error al guardar el registro del test diario.' });
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

// Obtener todos los registros de `testDiario` con día, mes, año, hora, minuto y segundo
router.get('/test-diario/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [results] = await db.query(
            'SELECT DATE_FORMAT(fechaTestDiario, "%Y-%m-%d %H:%i:%s") AS fechaTestDiario FROM testDiario WHERE id_usuario = ? ORDER BY fechaTestDiario DESC',
            [userId]
        );

        if (results.length > 0) {
            // Devuelve un array con solo las fechas
            res.json(results.map(record => record.fechaTestDiario));
        } else {
            res.status(404).json({ error: 'No se encontraron registros de test diario para este usuario.' });
        }
    } catch (error) {
        console.error('Error al obtener los registros de test diario:', error);
        res.status(500).json({ error: 'Error al obtener los registros de test diario.' });
    }
});

module.exports = router;
