const express = require('express')
const ruta = require('./controladores')
const logi = require('./log')
//const serverless = require('serverless-http')
// const router = express.Router();
//const realtaim = require('./realtaim.js')
//const oracle = require('.././example.js')
const cors = require('cors')

const app = express()
const bodyParser = require('body-parser')
//const ServerlessHttp = require('serverless-http')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use(cors)

let corsOptions = {
    origin: function (origin, callback) {
      // db.loadOrigins is an example call to load
      // a list of origins from a backing database
      db.loadOrigins(function (error, origins) {
        callback(error, origins)
      })
    }
  }
  app.use(cors({
    origin: '*',
    methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS'],
    allowedHeaders: 'Origin, X-Requested-With, Content-Type, Accept',
  }));
app.listen(8080)
console.log('server on port http:/localhost/'+8080)

//rutas
app.get('/',ruta.pruebame)
// app.get('/consulta',ruta.probandobd)
// app.get('/agregarproducto/:cod/:prod/:prec/:local',ruta.agregarproducto)
// app.get('/actualizarprecio/:cod/:prec/:local',ruta.actualizarproducto)
// app.get('/masproductos',realtaim.insertardatorandom)
// app.get('/graf',realtaim.dataparagrafica)
app.post('/getdato',ruta.registrarubicacion)
app.get('/trackeo',ruta.trackcamiones)
app.post('/datab',ruta.databruta)
app.post('/givmientregas',ruta.cargarentregas)
app.post('/updateentrega',ruta.actualizarentrega)
app.post('/log',logi.login)
app.get('/dataentregas/:desde/:hasta',ruta.tablaentregas)
app.get('/users',ruta.getusers)
app.post('/setusers',ruta.setusers)

//module.exports.handler = serverless(app)