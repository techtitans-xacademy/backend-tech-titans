export function formatoFecha(fecha) {
    const opciones = { day: '2-digit', month: '2-digit', year: 'numeric' };
    return new Date(fecha).toLocaleDateString('es-AR', opciones);
}

export function formatoMes(fecha) {
    // const opciones = { month: '2-digit', year: 'numeric' };
    // return new Date(fecha).toLocaleDateString('es-AR', opciones);

    console.log("Fecha original: ", fecha);

    // const partesFecha = fecha.split('-');
    // if (partesFecha.length !== 2) {
    //     return 'Fecha inválida';
    // }

    // console.log("Parte fecha: ", partesFecha);
    // const mesNumerico = parseInt(partesFecha[0]);
    // const ano = parseInt(partesFecha[1]);

    // if (isNaN(mesNumerico) || isNaN(ano)) {
    //     return 'Fecha inválida';
    // }

    // const meses = [
    //     'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    //     'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    // ];

    // const mesTexto = meses[mesNumerico - 1];

    // return `${mesTexto} ${ano}`;

    if (!(fecha instanceof Date)) {
        return 'Fecha inválida';
    }

    const meses = [
        'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
        'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ];

    const mesTexto = meses[fecha.getMonth()];
    const ano = fecha.getFullYear();

    return `${mesTexto} ${ano}`;
}

export function formatoMes2(fechaStr) {
    const fecha = new Date(fechaStr);

    if (isNaN(fecha)) {
        return 'Fecha inválida';
    }

    const meses = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const mesTexto = meses[fecha.getMonth()];
    const ano = fecha.getFullYear();

    return `${mesTexto} ${ano}`;
}

export function formatDate(date) {
    date = date.toISOString();
    if (typeof date !== 'string') {
        throw new Error('Date no es una cadena de texto.');
    }

    const fullDate = date.split('T');

    return fullDate[0];
}

export function formatoHora(hora) {
    const partes = hora.split(':');

    if (partes.length >= 2) {
        const horaFormateada = `${partes[0]}:${partes[1]}`;
        return horaFormateada;
    } else {
        return hora;
    }
}

export function formatoDecimalAEntero(numeroDecimal) {
    const numeroRedondeado = Math.round(numeroDecimal);
    return numeroRedondeado.toLocaleString('es-AR');
}