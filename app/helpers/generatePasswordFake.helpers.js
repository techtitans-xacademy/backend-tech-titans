export const generarContrasena = () => {
    const caracteres = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numeros = '0123456789';
    const simbolos = '!@#$%^&*()-_=+[{]};:<>|./?';

    const longitud = ~~(Math.random() * (20 - 6 + 1)) + 6;
    const requisitos = [caracteres, caracteres.toUpperCase(), numeros, simbolos];
    const requisitosCumplidos = [false, false, false, false];

    let contrasena = '';

    while (contrasena.length < longitud) {
        const indiceRequisito = ~~(Math.random() * requisitos.length);
        const requisito = requisitos[indiceRequisito];

        if (!requisitosCumplidos[indiceRequisito]) {
            contrasena += requisito[~~(Math.random() * requisito.length)];
            requisitosCumplidos[indiceRequisito] = true;
        } else {
            contrasena += caracteres[~~(Math.random() * caracteres.length)];
        }
    }

    return contrasena;
}