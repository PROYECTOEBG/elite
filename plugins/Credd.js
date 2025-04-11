import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'GataJadiBot');

fs.readdir(baseDir, (err, files) => {
  if (err) return console.error('Error leyendo GataJadiBot:', err);

  files.forEach(folder => {
    const folderPath = path.join(baseDir, folder);
    const credsPath = path.join(folderPath, 'creds.json');

    fs.stat(folderPath, (err, stats) => {
      if (err || !stats.isDirectory()) return;

      fs.access(credsPath, fs.constants.F_OK, (err) => {
        if (err) {
          // creds.json no existe, eliminar carpeta
          fs.rm(folderPath, { recursive: true, force: true }, (err) => {
            if (err) {
              console.error(`Error eliminando ${folder}:`, err);
            } else {
              console.log(`Carpeta eliminada: ${folder}`);
            }
          });
        }
      });
    });
  });
});
