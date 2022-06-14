const db = require('./db.js')


let users
const actualizarname = async()=>{
    let salida = await db.select('users')
    users = salida
    console.log('users cargados')
    //console.log(salida)
    return salida
}
const promise = actualizarname()



const login = async(req,res)=>{
    let hora = new Date();console.log(hora, 'login')
    const tiempoHtoken = 1
    //console.log(req.body)
    const {user,pass} = req.body
    let consulta = await db.select('users',{user:user,pass:pass})
    consulta = consulta.filter((item)=>{return item.user==user&&item.pass==pass})
    let validador
    try{
        validador = consulta[0].user
    }catch{
        validador = undefined
    }
    //console.log(consulta,validador)
    if(validador){
        let hora1 = new Date();let hora = hora1.getTime()+(tiempoHtoken*60*60*1000)
        let name = consulta[0].name
        let seckey = hora1.getTime()+''+hora1.getTime()+''
        await db.update('users',{user:user},{$set:{seckey:seckey}})
        consulta = await db.select('users')
        users = consulta
        consulta = consulta.filter((item)=>{return item.user==user&&item.pass==pass})
        //console.log(consulta)
        const token = {
            user:user,
            name:name,
            //vehicle:'HHHH-44',
            //ult_gestion:{ubic:'entrega',id:'jgegerjggrgr'},
            expiracion: hora,
            seckey:seckey
        }
        res.json({answer:'ok',token:token})
    }else{
        console.log('usuario y/o contraseña incorrectos')
        res.json({answer:'not ok'})
    }
}

const validagestion =async(token)=>{
    //console.log('validar',users)
    if(!token){
        console.log('sin token')
        return false
    }else{
        try{
            let consulta
            for(let i=0;i<users.length;i++){
                //console.log(users,users[i])
                if(users[i].user===token.user){
                    consulta = [users[i]]
                    break
                }
            }
            let tokenexp = new Date(token.exp);tokenexp=tokenexp.getTime()
            let now = new Date();now= now.getTime()
            if(now>=tokenexp){
                console.log('token expirado')
                return false
            }else if(consulta[0].seckey===token.seckey){
                //console.log('success')
                return true
            }else{
                console.log('seckey no válido')
                return false
            }
        }catch{
            setTimeout(()=>{validagestion(token)},5000)
        }
    }
}

module.exports = {
    login,
    validagestion
}