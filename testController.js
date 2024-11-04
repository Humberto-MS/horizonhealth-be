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
 const db = require('./db');  // Conexión a la base de datos
 
 // Guardar puntaje del test
 router.post('/guardar-puntaje', async (req, res) => {
     const { userId, puntaje } = req.body;
 
     // Validar que el puntaje esté entre 1 y 5
     if (puntaje < 1 || puntaje > 5) {
         return res.status(400).json({ error: 'Puntaje inválido. Debe estar entre 1 y 5.' });
     }
 
     try {
         const result = await db.query(
             'INSERT INTO test (id_usuario, puntaje, fecha_test) VALUES (?, ?, CURRENT_DATE)',
             [userId, puntaje]
         );
         res.status(201).json({ message: 'Puntaje guardado exitosamente', testId: result.insertId });
     } catch (error) {
         console.error('Error al guardar el puntaje del test:', error);
         res.status(500).json({ error: 'Error al guardar el puntaje del test' });
     }
 });
 
 module.exports = router;
 