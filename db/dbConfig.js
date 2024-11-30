/*:------------------------------------------------------------------------------------------------------
 *:                         HorizonHealth                          
 *:         Archivo de la configuración de la base de datos           
 *: Archivo       : dbConfig.js
 *: Autor         : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *:                 
 *: Fecha         : 09/10/2024
 *: Herramienta   : JavaScript con Express 
 *: Descripción   : Se realizará la configuración de la base de datos
 *: Ult.Modif.    : 09/10/2024
 *: Fecha: 09/10/2024 
 *: Modificó: Rodrigo Macias Ruiz 
 *: Modificación: configuración de la base de datos
 *:======================================================================================================
 *: 
 *: 09/10/2024: 
 *: Nombre : Rodrigo Macias Ruiz, Sergio Antonio López Delgado y Manuel Mijares Lara.
 *: Se realizará la configuración de la base de datos para empezar la conexión con la
 *: base de datos hecha en MySQL
 *:------------------------------------------------------------------------------------------------------
 */

const dotenv = require ( 'dotenv' );
dotenv.config ();

module.exports = {
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DB
};
  