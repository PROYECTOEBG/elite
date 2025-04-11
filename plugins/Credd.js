import fs from 'fs';
import path from 'path';

const baseDir = path.join(process.cwd(), 'GataJadiBot');

try {
  const folders = fs.readdirSync(baseDir);

  folders.forEach(folder => {
    const folderPath = path.join(baseDir, folder);

    if (fs.statSync(folderPath).isDirectory()) {
      const credsFile = path.join(folderPath, 'creds.json');

      if (!fs.existsSync(credsFile)) {
        fs.rmSync(folderPath, { recursive: true, force: true });
        console.log(`Carpeta eliminada: ${folderPath}`);
      }
    }
  });
} catch (err) {
  console.error('Error durante la limpieza de sesiones:', err);
}
