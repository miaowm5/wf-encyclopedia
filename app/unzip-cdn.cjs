const AdmZip = require('adm-zip');
const fs = require('fs');
const path = require('path');

const tasks = [
    { src: './cdn/cdn.zip',  dest: './resources/cdn/cdn' },
    { src: './cdn/cdn1.zip', dest: './resources/cdn/cdn1' },
    { src: './cdn/cdn2.zip', dest: './resources/cdn/cdn2' },
    { src: './cdn/cdn3.zip', dest: './resources/cdn/cdn3' }
];

tasks.forEach(({ src, dest }) => {
    if (!fs.existsSync(src)){
        console.warn(`File missing: ${src} , skiping.`)
        return
    };
    if (fs.existsSync(dest)) { fs.rmSync(dest, { recursive: true, force: true }); }
    fs.mkdirSync(dest, { recursive: true });
    const zip = new AdmZip(src);
    const entries = zip.getEntries();
    const firstEntry = entries.find(e => e.entryName.includes('/'));

    const randomDirName = firstEntry.entryName.split('/')[0] + '/';

    entries.forEach(entry => {
        if (entry.isDirectory || !entry.entryName.startsWith(randomDirName)) {
            return;
        }
        const strippedPath = entry.entryName.substring(randomDirName.length);
        if (!strippedPath) return;
        const finalPath = path.join(dest, strippedPath);
        const finalDir = path.dirname(finalPath);
        if (!fs.existsSync(finalDir)) { fs.mkdirSync(finalDir, { recursive: true }); }
        const content = zip.readFile(entry);
        if (content) {
            fs.writeFileSync(finalPath, content);
            console.log(`${entry.entryName} -> ${finalPath}`)
        }
    });
});
