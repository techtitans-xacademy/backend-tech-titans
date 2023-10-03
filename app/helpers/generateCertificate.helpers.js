import { PDFDocument, rgb, degrees, StandardFonts } from 'pdf-lib';
import * as fs from 'fs';
import createSlug from "../utils/createSlug.js";
import path from "path";
import { logger } from '../utils/winston.logger.js';

export async function generateCertificate(nombre, curso, dia, hora, duracion, mes, lugar) {
    try {
        const imageBytes = fs.readFileSync('assets/img/logo.png');
        // Crea un nuevo documento PDF en blanco
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]); // Tamaño de la página en puntos

        // Define los colores de los bordes
        const orangeColor = rgb(255 / 255, 102 / 255, 0 / 255);
        const blueColor = rgb(0 / 255, 51 / 255, 153 / 255);

        const image = await pdfDoc.embedPng(imageBytes);
        const imageSize = image.scale(0.2);

        page.drawImage(image, {
            x: 250, // Cambia la posición en el eje X
            y: 290, // Cambia la posición en el eje Y
            width: imageSize.width,
            height: imageSize.height,
            rotate: degrees(0), // Puedes rotar la imagen si es necesario
        });

        // Dibuja el primer borde naranja
        page.drawRectangle({
            x: 20,
            y: 20,
            width: 560,
            height: 360,
            borderColor: orangeColor,
            borderWidth: 5,
        });

        // Dibuja el segundo borde azul
        page.drawRectangle({
            x: 10,
            y: 10,
            width: 580,
            height: 380,
            borderColor: blueColor,
            borderWidth: 5,
        });

        // Agrega contenido al certificado
        const grayColor = rgb(64 / 255, 64 / 255, 64 / 255);
        const { width, height } = page.getSize();

        const text = "Se certifica que";
        const fontSizeText = 20;
        const fontText = await pdfDoc.embedFont(StandardFonts.Helvetica);
        page.drawText(text, {
            x: width / 2 - fontText.widthOfTextAtSize(text, fontSizeText) / 2, // Calcula la posición X para centrar
            y: 260,
            size: fontSizeText,
            color: grayColor,
            font: fontText,
            align: 'center', // Centra horizontalmente
        });

        const fontNombre = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const fontSize = 30;
        page.drawText(nombre, {
            x: width / 2 - fontNombre.widthOfTextAtSize(nombre, fontSize) / 2, // Calcula la posición X para centrar
            y: 230,
            size: fontSize,
            color: rgb(105 / 255, 102 / 255, 205 / 255), //rgba (105, 102, 205, 1)
            font: fontNombre,
            align: 'center', // Centra horizontalmente
        });

        const msg = `ha aprobado y completado con éxito el curso de`;
        const fsM = 20;
        const fontMsg = await pdfDoc.embedFont(StandardFonts.Helvetica);

        page.drawText(msg, {
            x: width / 2 - fontMsg.widthOfTextAtSize(msg, fsM) / 2, // Calcula la posición X para centrar
            y: 200,
            size: fsM,
            color: grayColor,
            font: fontMsg,
            align: 'center', // Centra horizontalmente
        });

        const fontCurso = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        page.drawText(curso, {
            x: width / 2 - fontCurso.widthOfTextAtSize(curso, fsM) / 2, // Calcula la posición X para centrar
            y: 175,
            size: fsM,
            color: rgb(0, 0, 0),
            font: fontCurso,
            align: 'center', // Centra horizontalmente
        });

        const dMsg = `El cual fue dictado el dia ${dia} a las ${hora} horas`;
        const fontdMsg = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fsD = 15;
        page.drawText(dMsg, {
            x: width / 2 - fontdMsg.widthOfTextAtSize(dMsg, fsD) / 2, // Calcula la posición X para centrar
            y: 140,
            size: fsD,
            color: grayColor,
            font: fontdMsg,
            align: 'center', // Centra horizontalmente
        });

        const dMsg2 = `y su duración fue de ${duracion}`;
        const fontdMsg2 = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fsD2 = 15;
        page.drawText(dMsg2, {
            x: width / 2 - fontdMsg2.widthOfTextAtSize(dMsg2, fsD2) / 2, // Calcula la posición X para centrar
            y: 125,
            size: fsD2,
            color: grayColor,
            font: fontdMsg2,
            align: 'center', // Centra horizontalmente
        });

        const lugarM = `${lugar}, ${mes}`
        const fontLug = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const fsL = 20;
        page.drawText(lugarM, {
            x: width / 2 - fontLug.widthOfTextAtSize(lugarM, fsL) / 2,
            y: 60,
            size: fsL,
            color: rgb(0, 0, 0),
            font: fontLug,
            align: 'center'
        })

        // Guarda el PDF en un archivo
        const pdfBytes = await pdfDoc.save();

        let nameArchivo = `certificado-${createSlug(nombre)}`;
        const ext = 'pdf';
        nameArchivo = `${nameArchivo}.${ext}`;
        const path = `uploads/certificados/${nameArchivo}`;
        fs.writeFileSync(path, pdfBytes);
        logger.info(`El alumno ${nombre} ha generado con éxito su certificado del curso ${curso}`);
        return path;
    } catch (error) {
        console.error('Error al generar el certificado:', error);
    }

}