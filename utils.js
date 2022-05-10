const fechayhoraconsulta = (fecha,tipo) => {
    let anno = fecha.getFullYear()
    let mes = fecha.getMonth() + 1
    if (mes < 10) {
        mes = '0' + mes
    }
    let dia = fecha.getDate()
    if (dia < 10) {
        dia = '0' + dia
    }
    //fecha.getHours()+":"+fecha.getMinutes()+":"+fecha.getSeconds()
    let hora = fecha.getHours()
    if (hora < 10) {
        hora = '0' + hora
    }
    let minutos = fecha.getMinutes()
    if (minutos < 10) {
        minutos = '0' + minutos
    }
    let segundos = fecha.getSeconds()
    if (segundos < 10) {
        segundos = '0' + segundos
    }
    if(tipo == 2){
        return anno + '-' + mes + '-' + dia 
    }else{
        return anno + '-' + mes + '-' + dia + ' ' + hora + ':' + minutos + ':' + segundos
    }
    
}

module.exports = {
    fechayhoraconsulta
}