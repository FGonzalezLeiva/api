const ok = require('dotenv').config()
console.log()
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = 'mongodb+srv://app:VJhExH0QYoBo8qJc@cluster0.68xdv.mongodb.net/Cluster0?retryWrites=true&w=majority';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

// client.connect(err => {
//   const collection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log(collection)
//   client.close();
// });

//Crear base de datos
// MongoClient.connect(uri, function(err, db) {
//     if (err) throw err;
//     var dbo = db.db("mydb");
//     dbo.createCollection("transantiago", function(err, res) {
//       if (err) throw err;
//       console.log("Collection created!");
//       db.close();
//     });
//   });
//registros => trackeo camiones
//entregas => registro entregas
//pruebas => probar

const reboot = async(tabla)=>{
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        const dbo = db.db("mydb");
        dbo.collection(tabla).deleteMany({}, function(err, obj) {
          if (err) throw err;
          //console.log("1 document inserted");
          db.close();
        });
      });
}

const insert = async(array,tabla)=>{
    //console.log(array)
    let data
    let ans
    let array1 = [array]
    //console.log(Object.keys(array)[0].length,Object.keys(array1)[0].length)
    if(Object.keys(array)[0].length===1){
        array1 = array
    }
    try{
        data = array1.length
    }catch{
        data = 0
    }
    //console.log(data,array1)
    if(data===0){
        ans = 'no data'   
    }else if(data===1){
        ans = '1 elemento'
        let ingresar = array1[0]
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            const dbo = db.db("mydb");
            //console.log('ingresar uno ',array)
            //{dato1:'fhfdjhg'}
            //console.log(tabla,ingresar)
            dbo.collection(tabla).insertOne(ingresar, function(err, res) {
              if (err) throw err;
              //console.log("1 document inserted");
              db.close();
            });
          });
    }else{
        ans = 'many elementos'
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            const dbo = db.db("mydb");
            //console.log(array)
            dbo.collection(tabla).insertMany(array, function(err, res) {
              if (err) throw err;
              //console.log(`${array.length} documents inserted`);
              db.close();
            });
          });        
    }
}

const select = async(tabla,query)=> {
    //que no tengo una columna(:0) y que la tenga (:1) : { projection: { address: 0 } }
    const client = await MongoClient.connect(uri, { useNewUrlParser: true })
        .catch(err => { console.log(err); });
    if (!client) {
        return;
    }
    try {
        const dbo = client.db("mydb");
        //console.log(query)
        let filtro
        let col
        let orden
        try{filtro = query.filtro?query.filtro:{}}catch{filtro ={}}
        try{col = query.columnas?{projection: query.columnas}:{}}catch{col={}}
        try{orden = query.sort?query.sort:{}}catch{orden ={}}
        
        //console.log(filtro,col,orden)
        let res = await dbo.collection(tabla).find(filtro,col).sort(orden).toArray();
        return res
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

const update = async(tabla,query,set)=>{
    const client = await MongoClient.connect(uri, { useNewUrlParser: true })
    .catch(err => { console.log(err); });
        if (!client) {
            return;
        }
        try {
            const dbo = client.db("mydb");
            //console.log(query)
            let filtro = query
            let nuevovalor = set
            //ejemplo de nuevo valor : { $set: {name: "Mickey", address: "Canyon 123" } };
            //console.log(filtro,nuevovalor)
            let res = await dbo.collection(tabla).updateOne(filtro,nuevovalor)
            //console.log('resultado update',res)
            return res
        } catch (err) {
            console.log(err);
        } finally {
            client.close();
        }
}

const delete_ = async(tabla,query)=>{
    MongoClient.connect(uri, function(err, db) {
        if (err) throw err;
        const dbo = db.db("mydb");
        const myquery = query
        dbo.collection(tabla).deleteOne(myquery, function(err, obj) {
          if (err) throw err;
          console.log("1 document deleted");
          db.close();
        });
      });
}

module.exports = {
    insert,
    select,
    update,
    reboot,
    delete_
}
