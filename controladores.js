const or = require('.././example.js')


const pruebame = async(req,res) => {
    console.log('Consulta base')
    res.status(200).json({ans:'ok'})
}


const probandobd = async(req,res)=>{
    const consulta = await or.run('select * from PRODUCTO')
    //console.log(consulta)
    console.log('Consultado los productos del cliente 1')
    console.log(consulta)
    res.json(consulta)
}

const agregarproducto = async(req,res)=>{
    const {cod,prod,prec,local} = req.params
    //console.log(`insert into PRODUCTO values('${cod}','${prod}','${prec}','${local}')`)
    const crearproducto = await or.run(`insert into PRODUCTO values(sec_prod.NEXTVAL,'${cod}','${prod}','${prec}','${local}')`)
    if(crearproducto){
        console.log(`producto ${prod} del local ${local} guardado`)
        res.status(200).send('producto guardado')
    }else{
        console.log('Producto no guardado')
        res.status(200).send('Algo falló. Porducto no guardado')
    }

}

const actualizarproducto = async(req,res)=>{
    const {cod,prec,local} = req.params
    //console.log(`insert into PRODUCTO values('${cod}','${prod}','${prec}','${local}')`)
    const actualizaproducto = await or.run(`select precio from PRODUCTO where cod = '${cod}' and Local = ${local} FETCH NEXT 1 ROWS ONLY`)
    const precioantiguo = actualizaproducto[0][0]
    const actualizaproducto1 = await or.run(`insert into HISTORIAL_PREC VALUES(sec_hist.NEXTVAL,CURRENT_TIMESTAMP,${precioantiguo},${prec},${local},'${cod}')`)
    const actualizaproducto2 = await or.run(`update PRODUCTO set precio= ${prec} WHERE cod = '${cod}' and Local = ${local}`)
    if(actualizaproducto && actualizaproducto1 && actualizaproducto2){
        res.status(202).send('ok')
    }else{
        res.status(400).send('algo pasó')
    }
    

}

const registrarventa = async(req,res)=>{
    console.log(`Insert into MOVIMIENTOS(RESPONSABLE,FECHAYHORA,LOCAL,TIPO,FORMA_PAGO,OBJ_MOV) values('Francisco González',CURRENT_TIMESTAMP,1,"Venta",2,"{}")`)
}

const registrarubicacion = async(req,res)=>{
    //console.log(req.params)
    let {lat,lon,fecha,responsable} = req.params
    fecha = fecha.replace('_',' ')
    //(TO_DATE('${fecha}', 'yyyy/mm/dd hh24:mi:ss'));
    const query = `insert into registrovehicle values(TO_DATE('${fecha}', 'dd-mm-yyyy hh24:mi:ss'),${lat},${lon},'${responsable}')`
    //console.log(query)
    await or.run(query)
     res.send('ok')
    // res.json({consulta : query})
}

const trackcamiones = async(req,res)=>{
    const data = await or.run('select * from registrovehicle where hora > sysdate-1 order by hora desc')
    const salida = []
    for(let i=0;i<data.length;i++){
        let existe = false
        for(let j=0;j<salida.length;j++){
            if(salida[j].user == data[i][3]){
                existe = true
                salida[j].data.push([data[i][1],data[i][2],data[i][0]])
            }
        }
        if(!existe){
            salida.push({user:data[i][3],data :[[data[i][1],data[i][2],data[i][0]]]})
        }
    }
    //console.log(data)
    console.log('dataconsultada')
    res.json(salida)
}


module.exports = {
    pruebame,
    probandobd,
    agregarproducto,
    actualizarproducto,
    registrarventa,
    registrarubicacion,
    trackcamiones
}