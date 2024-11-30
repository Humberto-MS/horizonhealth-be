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
require ('dotenv').config();

 const express = require('express');
 const app = express();
 const db = require('./db/db');
 const bodyParser = require('body-parser');
 const cors = require('cors');

 //configurar cors para permitir peticiones desde cualquier dominio :)
 app.use(cors());
 
 // Middleware
 app.use(bodyParser.json()); // Manejo de JSON
 app.use(bodyParser.urlencoded({ extended: true }));
 
 // Importar controladores
 const actividadController = require('./controllers/actividadController');
 const ejercicioController = require('./controllers/ejercicioController');
 const frasesController = require('./controllers/frasesController');
 const lecturaController = require('./controllers/lecturaController');
 const meditacionController = require('./controllers/meditacionController');
 const controladorUsuarios = require('./controllers/controladorUsuarios');
 const contactRouter = require('./controllers/contactController');
 const testController = require('./controllers/testController'); // Nuevo controlador para test
 
 // Rutas de controladores
 app.use('/api/actividades', actividadController);
 app.use('/api/ejercicios', ejercicioController);
 app.use('/api/frases', frasesController);
 app.use('/api/lecturas', lecturaController);
 app.use('/api/meditacion', meditacionController);
 app.use('/api/usuarios', controladorUsuarios);
 app.use('/api/contacto', contactRouter);
 app.use('/api/test', testController); // Ruta para el controlador de test
 
 // Ruta de prueba de conexión
 app.get('/', (req, res) => {
     res.send('Conexión exitosa con HorizonHealth API');
 });
 
 // Configuración del puerto
 const PORT = process.env.PORT || 3100;
 app.listen(PORT, () => {
     console.log(`Servidor escuchando en el puerto ${PORT}`);
 });
 
 module.exports = app;
 