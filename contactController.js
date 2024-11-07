
const express = require('express');
const nodemailer = require('nodemailer');

const router = express.Router();

router.post('/contact', async (req, res) => {
    const { nombre, apellido, correo, telefono, mensaje } = req.body;

    // Configuración del transporte de correo
    const transporter = nodemailer.createTransport({
        service: 'gmail', // Usa el servicio de correo, por ejemplo, 'gmail'
        auth: {
            user: 'tu_email@gmail.com', // Reemplaza con tu dirección de correo
            pass: 'tu_contraseña'       // Reemplaza con tu contraseña o token de aplicación
        }
    });

    // Opciones del correo
    const mailOptions = {
        from: correo,
        to: 'csunset.wellness.hh@gmail.com',
        subject: 'Nuevo mensaje de contacto',
        text: `
        Nombre: ${nombre} ${apellido}   
        Correo Electrónico: ${correo}
        Teléfono: ${telefono}
        Mensaje: ${mensaje}
        `
    };

    // Enviar el correo
    try {
        await transporter.sendMail(mailOptions);
        res.status(200).json({ message: 'Correo enviado correctamente' });
    } catch (error) {
        console.error('Error al enviar el correo:', error);
        res.status(500).json({ error: 'Error al enviar el correo' });
    }
});

module.exports = router;
