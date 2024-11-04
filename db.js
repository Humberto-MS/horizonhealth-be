/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo de conexión a la base de datos           
 *: Archivo       : db.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *:                 
 *: Fecha         : 09/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Se realizará la conexión a la base de datos
 *: Ult.Modif.    : 09/10/2024
 *: Fecha: 09/10/2024 
 *: Modificó: Rodrigo Macias Ruiz 
 *: Modificación: conexión a la base de datos
 *:======================================================================================================
 *: 
 *: 09/10/2024: 
 *: Nombre : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Se realizará la conexión a la base de datos para empezar con la manipulación de la base de datos
 *: base de datos hecha en MySQL
 *:------------------------------------------------------------------------------------------------------
 */
 const mysql = require('mysql2/promise');

 // Configuración de la base de datos
 const dbConfig = {
     host: 'localhost',
     user: 'root',
     password: '1234',
     database: 'horizonhealth'
 };
 
 // Crear la conexión usando el modo de promesas
 const connection = mysql.createPool(dbConfig);
 
 module.exports = connection;
 