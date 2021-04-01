//process,   objeto gloval que corre a lo argo de toda la palicacin, es atualizado dependiendo del en torno en que este corriedno la App
//process.env.NOMBRE_DE_LA_VARIABLE,  Variables que se pueden definir y consultar y editar  fuera de la aplicacion "fuera de la Estructura de Carpetas de tu App" son definidas por el sistemas servicios como heroku o mlab etc.. permiten crear variables de entorno para tu App
//gestionar variables Globales para PRODUCCION Y DESAROLO

//====================
//Port
//====================
//process.env.PORT, Variable que suministra heroku si no existe, process.env.PORT = 3000
process.env.PORT = process.env.PORT || 3000;

//====================
//Entorno
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
//Base de datos enla nube
//====================
let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URL_DB_EKN47 = urlDB;