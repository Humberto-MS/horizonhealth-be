/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo del controlador de usuarios         
 *: Archivo       : controladorUsuarios.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 15/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Controlador para gestionar los registros y estado de premium de los usuarios
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Inclusión de lógica para usuarios premium e inicio de sesión
 *:======================================================================================================
 */

 const express = require('express');
 const bcrypt = require('bcrypt');
 const router = express.Router();
 const db = require('./db');  // Conexión a la base de datos
 
 // Registro de un nuevo usuario
 router.post('/registro', async (req, res) => {
     const { nombre, correo, contrasena, premium = false } = req.body;
 
     try {
         // Hash de la contraseña
         const hashedPassword = await bcrypt.hash(contrasena, 10);
         
         const result = await db.query(
             'INSERT INTO usuario (nombre, correo, contrasena, premium, fecha_de_creacion) VALUES (?, ?, ?, ?, CURRENT_DATE)',
             [nombre, correo, hashedPassword, premium]
         );
         res.status(201).json({ message: 'Usuario registrado exitosamente', userId: result.insertId });
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al registrar usuario' });
     }
 });
 
 // Inicio de sesión de un usuario
 router.post('/login', async (req, res) => {
    const { correo, contrasena } = req.query;  // Asegúrate de usar req.query si envías los datos en la URL

    try {
        console.log('Correo recibido:', correo);
        const [user] = await db.query('SELECT * FROM usuario WHERE correo = ?', [correo]);

        if (user.length > 0) {
            console.log('Usuario encontrado:', user[0]);

            // Verificar la contraseña usando bcrypt
            const isPasswordValid = await bcrypt.compare(contrasena, user[0].contrasena);
            console.log('¿La contraseña es válida?', isPasswordValid);

            if (isPasswordValid) {
                res.json({ message: 'Inicio de sesión exitoso', userId: user[0].id_usuario, premium: user[0].premium });
            } else {
                res.status(401).json({ error: 'Credenciales incorrectas' });
            }
        } else {
            res.status(404).json({ error: 'Usuario no encontrado' });
        }
    } catch (error) {
        console.error('Error en el inicio de sesión:', error);
        res.status(500).json({ error: 'Error al iniciar sesión' });
    }
});
 
 // Actualizar usuario a premium
 router.put('/upgrade/:userId', async (req, res) => {
     const { userId } = req.params;
 
     try {
         const [user] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0) {
             await db.query('UPDATE usuario SET premium = TRUE WHERE id_usuario = ?', [userId]);
             res.json({ message: 'Usuario actualizado a premium exitosamente' });
         } else {
             res.status(404).json({ error: 'Usuario no encontrado' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al actualizar a premium' });
     }
 });
 
 // Verificar si un usuario es premium
 router.get('/premium-status/:userId', async (req, res) => {
     const { userId } = req.params;
 
     try {
         const [user] = await db.query('SELECT premium FROM usuario WHERE id_usuario = ?', [userId]);
 
         if (user.length > 0) {
             res.json({ userId, premium: user[0].premium });
         } else {
             res.status(404).json({ error: 'Usuario no encontrado' });
         }
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al verificar el estado premium' });
     }
 });
 
 // Obtener todos los usuarios (opcional)
 router.get('/usuarios', async (req, res) => {
     try {
         const [rows] = await db.query('SELECT id_usuario, nombre, correo, premium FROM usuario');
         res.json(rows);
     } catch (error) {
         console.error(error);
         res.status(500).json({ error: 'Error al obtener los usuarios' });
     }
 });
 
 module.exports = router;
 