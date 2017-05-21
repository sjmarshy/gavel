import { writeFile, stat, readFile } from 'fs';
import { join } from 'path';
import { List } from 'immutable';

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

function makeFile(path: string): Promise<{}> {
    return new Promise((resolve, reject) => {
        writeFile(path, '', 'utf8', err => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })

}

function listFromFile(path: string): Promise<List<string>> {
    return new Promise((resolve, reject) => {
        readFile(path, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            } else {
                console.log(data.split('\n').filter(x => x !== ''))
                resolve(
                    List(
                        data
                            .split('\n')
                            .map(d => d.trim())
                            .filter(x => x !== '')
                    )
                );
            }
        });
    });
}

function getPath(name: string): string {
    return join(__dirname, '../..', name);
}

export function set(name: string, list: List<string>): Promise<{}> {
    return new Promise((resolve, reject) => {
        writeFile(getPath(name), list.toArray().join('\n'), 'utf8', (err) => {
            if (err) {
                reject(err);
            } else {
                resolve();
            }
        })
    })
}

export function get(name: string): Promise<List<string>> {
    const path = getPath(name);
    return fileExists(path)
        .then(exists => {
            if (!exists) {
                return makeFile(path).then((): List<string> => List<string>());
            } else {
                return listFromFile(path);
            }
        })
}