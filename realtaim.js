const or = require('.././example.js')

const insertardatorandom = async(req,res)=>{
    let fruta = ''
    let qu = 0
   const frutal = Math.random()
    const cantidad = Math.random()

        //definiendo fruta
    if(frutal<=0.33){
        fruta = 'Manzana'
    }
    else if(frutal <= 0.66){
        fruta = 'Piña'
    }else{
        fruta = 'Coco'
    }

        //definiendo cantidad
    if(cantidad<=0.25){
        qu = 1
    }
    else if(cantidad <= 0.5){
        qu = 2
    }else if(cantidad <= 0.75){
        qu = 3
    }else {
        qu = 4
    }

    const consultota = await or.run(`insert into tiemporeal(name,cantidad) values('${fruta}',${qu})`)
    if(consultota==undefined){
        res.status(202).json({
            fruta:fruta,
            cantidad:qu
        })
    }else{
        res.status(400).send('algo pasó, que sad')
    }
}

const dataparagrafica = async(req,res)=>{
    const consultota = await or.run(`select name,sum(cantidad) from tiemporeal group by name`)
    console.log(consultota)
    let salida = []
    // for(let i=0;i<consultota.rows;i++){
    //     salida.push()
    // }
    if(consultota){
        res.status(202).send(consultota)
    }else{
        res.status(400).send('algo pasó, que sad')
    }
}

module.exports = {
    insertardatorandom,
    dataparagrafica
}