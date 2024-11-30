/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de frases       
 *: Archivo       : frasesController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `frases` y `frasesPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('../db/db');  // Conexión a la base de datos
 
 // Obtener una frase del día basada en el puntaje del test (para usuarios no premium)
 router.get('/frases-del-dia', async (req, res) => {
     const { puntaje } = req.query;
 
     // Validar que el puntaje esté entre 1 y 5
     if (puntaje < 1 || puntaje > 5) {
         return res.status(400).json({ error: 'Puntaje inválido. Debe estar entre 1 y 5.' });
     }
 
     try {
         // Consultar una frase basada en el puntaje en la tabla de frases estándar
         const [frase] = await db.query(
             'SELECT frase, autor FROM frases WHERE puntajeFrase = ? ORDER BY RAND() LIMIT 1',
             [puntaje]
         );
         res.json(frase[0] || { error: 'No se encontró una frase para el puntaje proporcionado.' });
     } catch (error) {
         console.error('Error al obtener la frase del día:', error);
         res.status(500).json({ error: 'Error al obtener la frase del día' });
     }
 });
 
 // Obtener una frase premium aleatoria basada en el puntaje proporcionado (solo para usuarios premium)
 router.get('/frases/premium', async (req, res) => {
     const { userId, puntaje } = req.query;
 
     // Validar que el puntaje esté entre 1 y 5
     if (puntaje < 1 || puntaje > 5) {
         return res.status(400).json({ error: 'Puntaje inválido. Debe estar entre 1 y 5.' });
     }
 
     try {
         // Verificar si el usuario es premium
         const [userResults] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
         const user = userResults[0];
 
         if (user && user.premium) {
             // Consultar una frase premium basada en el puntaje proporcionado
             const [frasePremium] = await db.query(
                 'SELECT frasePre AS frase, autorPre AS autor FROM frasesPremium WHERE puntajeFrasePre = ? ORDER BY RAND() LIMIT 1',
                 [puntaje]
             );
             res.json(frasePremium[0] || { error: 'No se encontró una frase premium para el puntaje proporcionado.' });
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error('Error al obtener la frase premium:', error);
         res.status(500).json({ error: 'Error al obtener la frase premium.' });
     }
 });
 
 module.exports = router;
 