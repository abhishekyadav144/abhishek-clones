import fs from 'fs';
import path from 'path';

const dir = './src';

const fixFile = (filePath) => {
  if (fs.statSync(filePath).isDirectory()) {
    fs.readdirSync(filePath).forEach(f => fixFile(path.join(filePath, f)));
  } else if (filePath.endsWith('.jsx')) {
    let content = fs.readFileSync(filePath, 'utf-8');
    let newContent = content.replace(/\\\$\{/g, '${').replace(/\\`/g, '`');
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log('Fixed', filePath);
    }
  }
}

fixFile(dir);
