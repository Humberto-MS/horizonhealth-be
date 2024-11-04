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
const mysql = require ( 'mysql' );
const dbConfig = {
  host: 'localhost',
  user: 'root',
  password: '1234',
  database: 'horizonhealth'
};

const connection = mysql.createConnection ( dbConfig );

connection.connect ( ( err ) => {
  if ( err ) {
    console.error ( 'Error conectando a la base de datos:', err );
    return;
  }
  console.log ( 'Conectado a la base de datos MySQL' );
} );

module.exports = connection;
