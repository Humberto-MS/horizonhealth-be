/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo de configuración y manejo de rutas principales           
 *: Archivo       : app.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Fecha         : 09/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Configura y maneja las rutas de la aplicación HorizonHealth
 *: Ult.Modif.    : 26/10/2024
 *: Modificación: Inclusión de rutas para controladores estándar y premium
 *:======================================================================================================
 */

 const express = require('express');
 const app = express();
 const db = require('./db');
 const bodyParser = require('body-parser');
 
 // Middleware
 app.use(bodyParser.json()); // Manejo de JSON
 app.use(bodyParser.urlencoded({ extended: true }));
 
 // Importar controladores
 const actividadController = require('./actividadController');
 const ejercicioController = require('./ejercicioController');
 const frasesController = require('./frasesController');
 const lecturaController = require('./lecturaController');
 const meditacionController = require('./meditacionController');
 const controladorUsuarios = require('./controladorUsuarios');
 const contactRouter = require('./contactController'); 

 // Rutas de controladores
 app.use('/api/actividades', actividadController);
 app.use('/api/ejercicios', ejercicioController);
 app.use('/api/frases', frasesController);
 app.use('/api/lecturas', lecturaController);
 app.use('/api/meditacion', meditacionController);
 app.use('/api/usuarios', controladorUsuarios); 
// Middleware para interpretar JSON
app.use(express.json());
// Ruta para el formulario de contacto
app.use('/api', contactRouter);


 // Ruta de prueba de conexión
 app.get('/', (req, res) => {
     res.send('Conexión exitosa con HorizonHealth API');
 });
 
 // Configuración del puerto
 const PORT = process.env.PORT || 3000;
 app.listen(PORT, () => {
     console.log(`Servidor escuchando en el puerto ${PORT}`);
 });
 
 module.exports = app;
 