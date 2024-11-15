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
 
 // Obtener frases del día basadas en el puntaje del test
 router.get('/frases-del-dia', async (req, res) => {
     const { puntaje } = req.query;
 
     // Validar que el puntaje esté entre 1 y 5
     if (puntaje < 1 || puntaje > 5) {
         return res.status(400).json({ error: 'Puntaje inválido. Debe estar entre 1 y 5.' });
     }
 
     try {
         // Consultar las frases basadas en el puntaje
         const [frases] = await db.query('SELECT frase, autor FROM frasesPremium WHERE puntajeFrase = ?', [puntaje]);
         res.json(frases);
     } catch (error) {
         console.error('Error al obtener las frases del día:', error);
         res.status(500).json({ error: 'Error al obtener las frases del día' });
     }
 });
 
 // Obtener preguntas del test semanal
 router.get('/preguntas-test', async (req, res) => {
     try {
         const [preguntas] = await db.query('SELECT id_pregunta, texto_pregunta FROM pregunta_test');
         res.json(preguntas);
     } catch (error) {
         console.error('Error al obtener preguntas del test:', error);
         res.status(500).json({ error: 'Error al obtener preguntas del test' });
     }
 });
 
 // Guardar respuestas del test semanal
 router.post('/guardar-respuestas', async (req, res) => {
     const { userId, respuestas } = req.body;
 
     try {
         // Validar el formato de las respuestas
         if (!Array.isArray(respuestas) || respuestas.length === 0) {
             return res.status(400).json({ error: 'Las respuestas deben enviarse en un array.' });
         }
 
         // Insertar cada respuesta en la base de datos
         for (const respuesta of respuestas) {
             const { id_pregunta, respuesta_valor } = respuesta;
 
             if (respuesta_valor < 1 || respuesta_valor > 5) {
                 return res.status(400).json({ error: `Respuesta inválida en la pregunta ${id_pregunta}. Debe estar entre 1 y 5.` });
             }
 
             await db.query(
                 'INSERT INTO respuesta_test (id_usuario, id_pregunta, respuesta, fecha_respuesta) VALUES (?, ?, ?, CURRENT_DATE)',
                 [userId, id_pregunta, respuesta_valor]
             );
         }
 
         res.status(201).json({ message: 'Respuestas del test guardadas exitosamente' });
     } catch (error) {
         console.error('Error al guardar respuestas del test:', error);
         res.status(500).json({ error: 'Error al guardar respuestas del test' });
     }
 });
 
 module.exports = router;
 