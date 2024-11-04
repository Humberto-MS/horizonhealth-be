/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de lectura       
 *: Archivo       : lecturaController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `lectura` y `lecturaPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('./db');  // Conexión a la base de datos
 
 // Obtener una lectura estándar aleatoria
 router.get('/lecturas', async (req, res) => {
     try {
         const [lectura] = await db.query('SELECT * FROM lectura ORDER BY RAND() LIMIT 1');
         res.json(lectura[0] || { error: 'No se encontraron lecturas' });
     } catch (error) {
         console.error('Error al obtener lectura:', error);
         res.status(500).json({ error: 'Error al obtener lectura' });
     }
 });
 
 // Obtener una lectura premium aleatoria (solo para usuarios premium)
 router.get('/lecturas/premium', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const userResults = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
         const user = userResults[0];
 
         if (user && user.length > 0 && user[0].premium) {
             const [lecturaPremium] = await db.query('SELECT * FROM lecturaPremium WHERE id_usuario = ? ORDER BY RAND() LIMIT 1', [userId]);
             res.json(lecturaPremium[0] || { error: 'No se encontraron lecturas premium' });
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error('Error al obtener lectura premium:', error);
         res.status(500).json({ error: 'Error al obtener lectura premium' });
     }
 });
 
 module.exports = router;
 