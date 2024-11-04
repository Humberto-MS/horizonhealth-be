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
 const db = require('./db');  // Conexión a la base de datos
 
 // Obtener una frase estándar aleatoria según el puntaje más reciente del usuario
 router.get('/frases', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const testResults = await db.query(
             'SELECT puntaje FROM test WHERE id_usuario = ? ORDER BY fecha_test DESC LIMIT 1',
             [userId]
         );
 
         const test = testResults[0];
         if (test && test.length > 0) {
             const puntaje = test[0].puntaje;
             const [frase] = await db.query(
                 'SELECT frase, autor FROM frases WHERE puntajeFrase = ? ORDER BY RAND() LIMIT 1',
                 [puntaje]
             );
             res.json(frase[0] || { error: 'No se encontraron frases' });
         } else {
             res.status(404).json({ error: 'No se encontró un puntaje reciente para este usuario.' });
         }
     } catch (error) {
         console.error('Error al obtener frase estándar:', error);
         res.status(500).json({ error: 'Error al obtener la frase.' });
     }
 });
 
 // Obtener una frase premium aleatoria según el puntaje más reciente del usuario (solo para usuarios premium)
 router.get('/frases/premium', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const userResults = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
         const user = userResults[0];
 
         if (user && user.length > 0 && user[0].premium) {
             const testResults = await db.query(
                 'SELECT puntaje FROM test WHERE id_usuario = ? ORDER BY fecha_test DESC LIMIT 1',
                 [userId]
             );
 
             const test = testResults[0];
             if (test && test.length > 0) {
                 const puntaje = test[0].puntaje;
                 const [frasePremium] = await db.query(
                     'SELECT frasePre AS frase, autorPre AS autor FROM frasesPremium WHERE puntajeFrasePre = ? ORDER BY RAND() LIMIT 1',
                     [puntaje]
                 );
                 res.json(frasePremium[0] || { error: 'No se encontraron frases premium' });
             } else {
                 res.status(404).json({ error: 'No se encontró un puntaje reciente para este usuario.' });
             }
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error('Error al obtener frase premium:', error);
         res.status(500).json({ error: 'Error al obtener la frase premium.' });
     }
 });
 
 module.exports = router;
 