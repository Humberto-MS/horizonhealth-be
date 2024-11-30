/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de meditación       
 *: Archivo       : meditacionController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 24/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de la tabla `meditacion`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso exclusivo a usuarios premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('../db/db'); // Conexión a la base de datos
 
 // Obtener sesiones de meditación para usuarios premium
 router.get('/meditacion', async (req, res) => {
     const { userId } = req.query;
 
     try {
         // Verificar si el usuario existe y es premium
         const [userResults] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (userResults.length === 0) {
             return res.status(404).json({ error: 'Usuario no encontrado.' });
         }
 
         const user = userResults[0];
         if (user.premium === 1) { // Verifica explícitamente si es premium
            const [rows] = await db.query(
                `SELECT id_meditacionPre, id_usuario, tiempo_meditacion, DATE_FORMAT(fecha_sesion, '%d-%m-%Y') AS fecha_sesion 
                 FROM meditacion 
                 WHERE id_usuario = ? 
                 ORDER BY fecha_sesion DESC`,
                [userId]);
             res.json(rows);
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error('Error al obtener sesiones de meditación:', error);
         res.status(500).json({ error: 'Error al obtener sesiones de meditación.' });
     }
 });
 
 // Registrar una nueva sesión de meditación (solo usuarios premium)
 router.post('/meditacion', async (req, res) => {
     const { userId, duracion, fechaSesion } = req.body;
 
     try {
         // Verificar si el usuario es premium
         const [userResults] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (userResults.length === 0) {
             return res.status(404).json({ error: 'Usuario no encontrado.' });
         }
 
         const user = userResults[0];
         if (user.premium === 1) { // Verifica explícitamente si es premium
             // Registrar la sesión de meditación
             const result = await db.query(
                 'INSERT INTO meditacion (id_usuario, tiempo_meditacion, fecha_sesion) VALUES (?, ?, ?)',
                 [userId, duracion, fechaSesion || new Date()]
             );
 
             res.status(201).json({
                 message: 'Sesión de meditación registrada exitosamente.',
                 sessionId: result.insertId
             });
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error('Error al registrar la sesión de meditación:', error);
         res.status(500).json({ error: 'Error al registrar la sesión de meditación.' });
     }
 });
 
 module.exports = router;
 