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
//     dbo.createCollection("entregas", function(err, res) {
//       if (err) throw err;
//       console.log("Collection created!");
//       db.close();
//     });
//   });
const insert = async(array,tabla)=>{
    //console.log(array)
    let data
    let ans
    try{
        data = array.length
    }catch{
        data = 0
    }
    if(data===0){
        ans = 'no data'
    }else if(data===1){
        ans = '1 elemento'
        let ingresar = array[0]
        MongoClient.connect(uri, function(err, db) {
            if (err) throw err;
            const dbo = db.db("mydb");
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
        let filtro = query.filtro?query.filtro:{}
        let col = query.columnas?{projection: query.columnas}:{}
        let orden = query.sort?query.sort:{}
        //console.log(filtro,col,orden)
        let res = await dbo.collection(tabla).find(filtro,col).sort(orden).toArray();
        return res
    } catch (err) {
        console.log(err);
    } finally {
        client.close();
    }
}

module.exports = {
    insert,
    select
}
