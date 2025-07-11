import fs from 'fs';
import path from 'path';

export const getBase64 = (relativePath: string) =>
    `data:image/png;base64,${fs.readFileSync(
        path.join(process.cwd(), relativePath),
        'base64'
    )}`;