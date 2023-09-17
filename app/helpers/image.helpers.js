import * as fs from 'fs';
import { logger } from '../utils/winston.logger.js';

export const createUploadsFolder = () => {
    fs.access(`./uploads`, (err) => {
        if (err) {
            fs.mkdir(`./uploads`, { recursive: true }, (err) => {
                if (err) {
                    console.error('Error al crear carpeta:', err);
                    logger.error('Error al crear carpeta:', err);
                } else {
                    console.log(`La carpeta uploads se creó correctamente.`);
                    logger.info(`La carpeta uploads se creó correctamente.`);
                }
            });
        } else {
            console.log('La carpeta de uploads ya existe.');
            logger.debug('La carpeta de uploads ya existe.');
        }
    });
}
export const checkFolderCreate = (folder) => {
    fs.access(`./uploads/${folder}`, (err) => {
        if (err) {
            // Crear la carpeta si no existe
            fs.mkdir(`./uploads/${folder}`, { recursive: true }, (err) => {
                if (err) {
                    console.error('Error al crear carpeta:', err);
                    logger.error('Error al crear carpeta:', err);
                } else {
                    console.log(`La carpeta ${folder} se creó correctamente.`);
                    logger.info(`La carpeta ${folder} se creó correctamente.`);
                }
            });
        } else {
            console.log(`La carpeta ${folder} ya existe en el directorio uploads`);
            logger.debug(`La carpeta ${folder} ya existe en el directorio uploads`);
        }
    });
}

export const deleteImageStorage = (folder, name) => {
    fs.stat(`./uploads/${folder}/${name}`, (err) => {
        if (!err) {
            fs.unlink(`./uploads/${folder}/${name}`, (info, err) => {
                if (info) {
                    logger.info(`Se borro la imagen ${name} de la carpeta ${folder}`);
                    console.log(`Se borro la imagen ${name} de la carpeta ${folder}`);
                }
                if (err) {
                    console.log("Hubo un error al borrar el archivo: " + err);
                    logger.error('No hay imagen para borrar')
                }

            });
        }
    });
}