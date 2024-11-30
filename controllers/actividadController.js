/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador para la sección de actividad       
 *: Archivo       : actividadController.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 23/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar recursos de las tablas `actividad` y `actividadPremium`
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Adaptación para acceso diferenciado a contenido premium
 *:======================================================================================================
 */

 const express = require('express');
 const router = express.Router();
 const db = require('../db/db');  // Conexión a la base de datos
 
 // Obtener una actividad estándar aleatoria
 router.get('/actividades', async (req, res) => {
     try {
         const [actividad] = await db.query('SELECT * FROM actividad ORDER BY RAND() LIMIT 1');
         res.json(actividad[0] || { error: 'No se encontraron actividades' });
     } catch (error) {
         console.error('Error al obtener actividad:', error);
         res.status(500).json({ error: 'Error al obtener actividad' });
     }
 });
 
 // Obtener una actividad premium aleatoria (solo para usuarios premium)
 router.get('/actividades/premium', async (req, res) => {
     const { userId } = req.query;
 
     try {
         const [userResults] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
         const user = userResults[0];
 
         if (user && user.premium) {
             const [actividadPremium] = await db.query('SELECT * FROM actividadPremium ORDER BY RAND() LIMIT 1');
             res.json(actividadPremium[0] || { error: 'No se encontraron actividades premium' });
         } else {
             res.status(403).json({ error: 'Acceso denegado. Solo disponible para usuarios premium.' });
         }
     } catch (error) {
         console.error('Error al obtener actividad premium:', error);
         res.status(500).json({ error: 'Error al obtener actividad premium' });
     }
 });
 
 module.exports = router;
 