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
 const db = require('./db');  // Conexión a la base de datos
 
 // Obtener sesiones de meditación para usuarios premium
 router.get('/meditacion', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const userResults = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
         const user = userResults[0];
 
         if (user && user.length > 0 && user[0].premium) {
             const [rows] = await db.query('SELECT * FROM meditacion WHERE id_usuario = ?', [userId]);
             res.json(rows);
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error('Error al obtener sesiones de meditación:', error);
         res.status(500).json({ error: 'Error al obtener sesiones de meditación' });
     }
 });
 
 module.exports = router;
 