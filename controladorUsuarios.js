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

// Importar configuración de Cloudinary y Multer
const cloudinary = require("../utils/cloudinary");
const upload = require("../middleware/multer");

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

// Endpoint para cambiar la foto de perfil del usuario
router.post('/usuarios/:userId/upload', upload.single('image'), async (req, res) => {
    const { userId } = req.params;

    try {
        // Subir la imagen a Cloudinary
        cloudinary.uploader.upload(req.file.path, async (err, result) => {
            if (err) {
                console.error('Error en la subida a Cloudinary:', err);
                return res.status(500).json({ success: false, message: "Error al subir la imagen" });
            }

            // Guardar la URL de la imagen en la base de datos
            await db.query('UPDATE usuario SET foto_perfil = ? WHERE id_usuario = ?', [result.secure_url, userId]);
            
            res.status(200).json({
                success: true,
                message: "Imagen subida y perfil actualizado",
                data: result
            });
        });
    } catch (error) {
        console.error('Error al actualizar la foto de perfil:', error);
        res.status(500).json({ error: 'Error al actualizar la foto de perfil' });
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

// Obtener todos los datos d eun usuario mediante su id
router.get('/usuarios/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const [row] = await db.query('SELECT * FROM usuario WHERE id_usuario = ?', [userId]);
        res.json(row);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener el ususario' });
    }
});


// Cambiar el nombre y el correo del usuario
router.put('/cambiar-datos/:userId', async (req, res) => {
    const { userId } = req.params;
    const { nombre, correo } = req.body;

    try {
        await db.query('UPDATE usuario SET nombre = ?, correo = ? WHERE id_usuario = ?', [nombre, correo, userId]);
        res.json({ message: 'Datos de usuario actualizados correctamente' });
    } catch (error) {
        console.error('Error al actualizar los datos del usuario:', error);
        res.status(500).json({ error: 'Error al actualizar los datos del usuario' });
    }
});

// Cambiar la contraseña del usuario
router.put('/cambiar-contrasena/:userId', async (req, res) => {
    const { userId } = req.params;
    const { contrasenaActual, nuevaContrasena } = req.body;

    try {
        // Obtener la contraseña actual del usuario desde la base de datos
        const [userResults] = await db.query('SELECT contrasena FROM usuario WHERE id_usuario = ?', [userId]);

        // Verificar que el usuario exista
        if (userResults.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = userResults[0];

        // Comparar la contraseña actual proporcionada con la almacenada (en formato hash)
        const isPasswordValid = await bcrypt.compare(contrasenaActual, user.contrasena);
        
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'La contraseña actual es incorrecta' });
        }

        // Hashear la nueva contraseña
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        // Actualizar la contraseña en la base de datos con la nueva contraseña hasheada
        await db.query('UPDATE usuario SET contrasena = ? WHERE id_usuario = ?', [hashedPassword, userId]);

        res.json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error('Error al cambiar la contraseña:', error);
        res.status(500).json({ error: 'Error al cambiar la contraseña' });
    }
});

// Eliminar la cuenta del usuario
router.delete('/eliminar-cuenta/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await db.query('DELETE FROM usuario WHERE id_usuario = ?', [userId]);
        res.json({ message: 'Cuenta eliminada correctamente' });
    } catch (error) {
        console.error('Error al eliminar la cuenta:', error);
        res.status(500).json({ error: 'Error al eliminar la cuenta' });
    }
});

// Cancelar la suscripción premium
router.put('/cancelar-suscripcion/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        await db.query('UPDATE usuario SET premium = FALSE WHERE id_usuario = ?', [userId]);
        res.json({ message: 'Suscripción premium cancelada correctamente' });
    } catch (error) {
        console.error('Error al cancelar la suscripción premium:', error);
        res.status(500).json({ error: 'Error al cancelar la suscripción premium' });
    }
});

module.exports = router;
