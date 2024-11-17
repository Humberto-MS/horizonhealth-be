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
 
 router.post('/guardar-puntaje', async (req, res) => {
    const { userId, puntaje } = req.body;

    // Depurar: Verificar los datos recibidos
    console.log('Datos recibidos:', { userId, puntaje });

    // Validar que el userId y puntaje sean proporcionados
    if (!userId || !puntaje) {
        return res.status(400).json({ error: 'Faltan datos obligatorios: userId y puntaje' });
    }

    // Validar que el puntaje esté entre 1 y 5
    if (puntaje < 1 || puntaje > 5) {
        return res.status(400).json({ error: 'Puntaje inválido. Debe estar entre 1 y 5.' });
    }

    try {
        const result = await db.query(
            'INSERT INTO test (id_usuario, puntaje, fecha_test) VALUES (?, ?, CURRENT_TIMESTAMP)',
            [userId, puntaje]
        );
        res.status(201).json({ message: 'Puntaje guardado exitosamente', testId: result.insertId });
    } catch (error) {
        console.error('Error al guardar el puntaje del test:', error);
        res.status(500).json({ error: 'Error al guardar el puntaje del test' });
    }
});

 
 // Obtener todos los resultados de los tests realizados por un usuario
 router.get('/resultados-test/:userId', async (req, res) => {
     const { userId } = req.params;
 
     try {
         const [results] = await db.query(
             'SELECT id_test, puntaje, fecha_test FROM test WHERE id_usuario = ? ORDER BY fecha_test DESC',
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
 
 module.exports = router;
 