import { writeFile, stat } from 'fs';

function fileExists(path: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
        stat(path, (err, stats) => {
            if (err && err.code === 'ENOENT') {
                resolve(false);
            } else if (err) {
                reject(err);
            } else {
                resolve(true);
            }
        });
    });
}