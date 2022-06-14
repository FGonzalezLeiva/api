const db = require('./db.js')
const appki = 'AIzaSyCNwXerxNtjR0XQd1FGlJYJFhdw1RIT4eU'
const logi = require('./log')
const ObjectId = require('mongodb').ObjectId;


// const latloncondir = ()=>{
//     const url = 'https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,+Mountain+View,+CA&key='+appki
//     const data = await axio
// }

const pruebame = async(req,res) => {
    try{
    console.log('Consulta base')
    await db.insert([{prueba:'dato1',item1:{item2:'item',item3:'item3'}}],'prueba')
    //insertar un usuario
    // await db.insert({user:'anakarina',pass:'123456789',name:'Ana Karina'},'users')
    // await db.insert({user:'cris',pass:'123456789',name:'Cristián'},'users')
    // await db.insert({user:'Leo',pass:'123456789',name:'Leo'},'users')
    const dato = await db.select('prueba')
    console.log(dato)
    await db.update('prueba',{_id:dato[0]._id},{$set:{item1:'modificado'}})
    const dato2 = await db.select('prueba')
    console.log(dato2)
    await db.reboot('prueba')
    //await db.reboot('entregas')
    //await db.reboot('registros')
    const dato1 = await db.select('prueba')
    console.log(dato1)
    console.log('end')
    res.status(200).json({ans:'ok'})
    }catch{
    res.status(200).json({ans:'not ok, try again'})   
    }
}


const registrarubicacion = async(req,res)=>{
    
    let obj = req.body.payload;
            //console.log(obj)
        let salida = {answer:'ok'}
        // console.log(obj)
        // res.json(obj)
        for(let i=0;i<obj.length;i++){
           // console.log(obj[i])
            obj[i].date = new Date(obj[i].timestamp)
//console.log(obj[i])
        }
        await db.insert(obj,'registros').catch(err=>{
           // console.log(err)
            salida = {answer:"error"}
        })
        //console.log(salida)
        res.json(salida)

}

const trackcamiones = async(req,res)=>{
    const horas = 1
    let desde = new Date();desde = new Date(desde.getTime()-1000*60*60*horas)
   // console.log(desde)
   const filter = {filtro:{date: {$gte: desde}},sort:{date:-1}}
  // console.log(filter)
    const data = await db.select('registros',filter ).catch(err=>console.log(err))
    //console.table(data)
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
    let obj = req.body
    console.log('databruta')
    const validador = await logi.validagestion(obj.token)
    //console.log(validador)
    if(!validador){
        console.log('No validado')
        res.json({ans:'no autenticado'})
    }else{
    const horas = 1
    let desde = new Date();desde = new Date(desde.getTime()-1000*60*60*horas)
   // console.log(desde)
   //const filter = {filtro:{date: {$gte: desde}},sort:{date:-1}}
    const data = await db.select('entregas').catch(err=>console.log(err))
    //console.log(data[0])
    const datafilter = data.filter((item)=>{return item.gestion.subido.encargado===obj.token.name})
    //console.log(datafilter)
    let salida
    if(data[0]){
        salida = {answer:'ok',data:datafilter}
    }else{
        salida = {answer: 'ok',data:'no data'}
    }
    
    res.json(salida)
    }

}

const cargarentregas = async(req,res)=>{
    let salida
    const data = req.body
    //console.log(data)
    const validador = await logi.validagestion(data.token)
    //console.log(validador)
    if(!validador){
        res.send({ans:'no autenticado'})
    }else{
        console.log(data)
        let info = data.data
        let gestion = data.gestion
        //validación rápida
        const datosasubir = []
        for(let i=0;i<info.length;i++){
            datosasubir.push({
                dia: info[i]['fech_ent_timestamp'],
                cliente:{
                    nombre:info[i].Nombre,
                    direccion:info[i].Dirección,
                    comuna:info[i]['Comuna Cliente']},
                gestion:{
                    subido:{hora:new Date(gestion.timestamp),
                    res:gestion.responsable,
                    fecha_entrega_estimada_timestamp:info[i]['fech_ent_timestamp'],
                    fecha_entrega_estimada_visual:info[i]['fech_ent_visual'],
                    encargado:info[i]['Reponsable entrega']}},
                logistica:[{precio:info[i].Precio,cantidad:info[i].Cantidad,producto:info[i].Producto,formapago:info[i]['Forma de Pago']}]
            })
        }
        await db.insert(datosasubir,'entregas').then(()=>{
            salida = {answer:'ok'}
            //console.log(info.length+ ' registros cargados')
        }).catch(err=>{
            console.log(err)
            salida = {answer:"error",err:err}
        })
        //console.log(datosasubir[0],datosasubir[0].gestion.subido,datosasubir[0].logistica);salida = {answer:'modo testeo'}
        res.json(salida)
    }
}

const actualizarentrega = async(req,res)=>{
    //cualquier tipo de getión tiene que pasar por acá
    let dato =req.body
    console.log(dato)
    const validador = await logi.validagestion(dato.token)
    //console.log(validador)
    if(!validador){
        res.send({ans:'no autenticado'})
    }else{
        const data = dato.data
        const id = {_id: data._id}
        delete data['_id']
        let modificar = data
        //console.log(data)
        if(data.gestion){
            if(data.gestion.subido){
                data.gestion.subido.hora = new Date(data.gestion.subido.hora)
            }
            if(data.gestion.tomado){
                if(data.gestion.tomado.hora){
                    data.gestion.tomado.hora = new Date(data.gestion.tomado.hora)
                }else{
                    data.gestion.tomado.hora = new Date(data.gestion.tomado.timestamp)
                }
            }
            if(data.gestion.entrega){
                if(data.gestion.entrega.hora){
                    data.gestion.entrega.hora = new Date(data.gestion.entrega.hora)
                }else{
                    data.gestion.entrega.hora = new Date(data.gestion.entrega.timestamp)
                }
            }
            if(data.gestion.desercion){
                if(data.gestion.desercion.hora){
                    data.gestion.desercion.hora = new Date(data.gestion.desercion.hora)
                }else{
                    data.gestion.desercion.hora = new Date(data.gestion.desercion.timestamp)
                }
            }
            if(data.gestion.observaciones){
                for(let i=0;i<data.gestion.observaciones.length;i++){
                    const log = data.gestion.observaciones[i]
                    data.gestion.observaciones[i].hora = log.hora?new Date(log.hora):new Date(log.timestamp)
                }
            }
        }


        console.log(ObjectId(id._id),data)
        await db.update('entregas',{_id:ObjectId(id._id)},{$set:data})//.then((data)=>{console.log(data)})
        res.send({answer:'ok'})
    }
}


const tablaentregas = async(req,res)=>{
    const {desde,hasta} = req.params
    let salida = []
    //console.log(desde,hasta);
    //{dia: {$gte: desde-1}},
    const filter = {filtro:{dia:{ $gte :parseInt(desde)-10 , $lte : parseInt(hasta)}},sort:{dia:-1}}
    //console.log(filter)
    const data = await db.select('entregas',filter ).catch(err=>console.log(err))
    //console.log(data)
    //salida = data

    for(let i=0;i<data.length;i++){
        //if(i==0){console.log(data[i])}
        let objeto ={}
        objeto.dia=data[i].gestion.subido.echa_entrega_estimada_visual
        objeto.nom_client=data[i].cliente.nombre
        objeto.direccion=data[i].cliente.direccion
        objeto.comuna= data[i].cliente.comuna
        objeto.responsable_informado = data[i].gestion.subido.res
        objeto.hora_informado = data[i].gestion.subido.hora
        objeto.encargado_a = data[i].gestion.subido.encargado
        //
        try{objeto.responsable_toma = data[i].gestion.tomado.res}catch{objeto.responsable_toma = null}
        try{objeto.hora_toma = data[i].gestion.tomado.hora}catch{objeto.hora_toma = null}
        try{objeto.responsable_entrega = data[i].gestion.entrega.res}catch{objeto.responsable_entrega = null}
        try{objeto.hora_entrega = data[i].gestion.entrega.hora}catch{objeto.hora_entrega = null}
        try{objeto.coords_entrega = [data[i].gestion.entrega.lat,data[i].gestion.entrega.lon]}catch{objeto.coords_entrega = null}
        try{objeto.responsable_desercion = data[i].gestion.desercion.res}catch{objeto.responsable_desercion = null}
        try{objeto.hora_desercion = data[i].gestion.desercion.hora}catch{objeto.hora_desercion = null}
        
        //console.log(data[i].logistica.length)
        for(let j=0;j<data[i].logistica.length;j++){

            objeto['precio'+j]= data[i].logistica[j].precio
            objeto['cantidad'+j]= data[i].logistica[j].cantidad
            objeto['producto'+j]= data[i].logistica[j].producto
        }
        salida.push(objeto)
    }

    res.json({ans:'ok',data:salida})

}

module.exports = {
    pruebame,
    registrarubicacion,
    trackcamiones,
    databruta,
    cargarentregas,
    actualizarentrega,
    tablaentregas
}