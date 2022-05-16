const db = require('./db.js')
const appki = 'AIzaSyCNwXerxNtjR0XQd1FGlJYJFhdw1RIT4eU'


// const latloncondir = ()=>{
//     const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key='+appki
//     const data = await axio
// }

const pruebame = async(req,res) => {
    console.log('Consulta base')
    res.status(200).json({ans:'ok'})
}


const registrarubicacion = async(req,res)=>{
    let obj = req.body;
    //console.log(obj)
    let salida = {answer:'ok'}
    // console.log(obj)
    // res.json(obj)
    for(let i=0;i<obj.length;i++){
        obj[i].date = new Date(obj[i].timestamp)
    }
    await db.insert(obj,'registros').catch(err=>{
        console.log(err)
        salida = {answer:"error"}
    })
    res.json(salida)
}

const trackcamiones = async(req,res)=>{
    const horas = 1
    let desde = new Date();desde = new Date(desde.getTime()-1000*60*60*horas)
   // console.log(desde)
   const filter = {filtro:{date: {$gte: desde}},sort:{date:-1}}
  // console.log(filter)
    const data = await db.select('registros',filter ).catch(err=>console.log(err))
   // console.table(data)
    const salida = []
    for(let i=0;i<data.length;i++){
        let existe = false
        for(let j=0;j<salida.length;j++){
            if(salida[j].user == data[i].responsable){
                existe = true
                salida[j].data.push([data[i].lat,data[i].lon,data[i].date])
            }
        }
        if(!existe){
            salida.push({user:data[i].responsable,data :[[data[i].lat,data[i].lon,data[i].date]]})
        }
    }
    //console.log(data)
console.log('dataconsultada')
res.json(salida)

}

const databruta = async(req,res)=>{
    const horas = 1
    let desde = new Date();desde = new Date(desde.getTime()-1000*60*60*horas)
   // console.log(desde)
   const filter = {filtro:{date: {$gte: desde}},sort:{date:-1}}
    const data = await db.select('registros',filter ).catch(err=>console.log(err))
    res.json(data)


}

const registrarentrega = async(req,res)=>{
    let obj = req.body;
    //console.log(obj)
    let salida = {answer:'ok'}
    // console.log(obj)
    // res.json(obj)
    for(let i=0;i<obj.length;i++){
        obj[i].date = new Date(obj[i].timestamp)
    }
    await db.insert(obj,'entregas').catch(err=>{
        console.log(err)
        salida = {answer:"error"}
    })
    res.json(salida)
}

module.exports = {
    pruebame,
    registrarubicacion,
    trackcamiones,
    databruta,
    registrarentrega
}