//====================
//Port
//====================

//t1

process.env.PORT = process.env.PORT || 3000;
//====================
//Entorno
//====================

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//====================
//Base de datos
//====================
let urlDB;
if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe';
} else {
    urlDB = 'mongodb+srv://ekn47:gEUuutxPKeHmX9oh@cafe.6nu9k.mongodb.net/cafe?retryWrites=true&w=majority';
}
process.env.URL_DB_EKN47 = urlDB;