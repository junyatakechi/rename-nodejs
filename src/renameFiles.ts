import fs from "fs";
import path from 'path';
import csvParser from 'csv-parser';

interface RenameMapping {
  oldFilename: string;
  newFilename: string;
}

function readRenameMappingsFromCsv(csvFilePath: string): Promise<RenameMapping[]> {
  return new Promise((resolve, reject) => {
    const renameMappings: RenameMapping[] = [];

    fs.createReadStream(csvFilePath)
      .pipe(csvParser({ headers: ['oldFilename', 'newFilename'] }))
      .on('data', (row: RenameMapping) => {
        renameMappings.push(row);
      })
      .on('end', () => {
        resolve(renameMappings);
      })
      .on('error', (err) => {
        reject(err);
      });
  });
}

//
async function renameFiles(directory: string, csvFilePath: string): Promise<void> {
  try {
    const renameMappings = await readRenameMappingsFromCsv(csvFilePath);

    fs.readdir(directory, (err, files) => {
      if (err) {
        console.error(`Error reading directory: ${err.message}`);
        return;
      }

      files.forEach(file => {
        const filePath = path.join(directory, file);

        renameMappings.forEach(mapping => {
          if (mapping.oldFilename === file) {
            const newFilePath = path.join(directory, mapping.newFilename);
            console.log(newFilePath);

            fs.rename(filePath, newFilePath, (err) => {
              if (err) {
                console.error(`Error renaming file: ${err.message}`);
              } else {
                console.log(`File renamed from ${filePath} to ${newFilePath}`);
              }
            });
          }
        });
      });
    });
  } catch (err:any) {
    console.error(`Error reading CSV file: ${err.message}`);
  }
}

// 引数の取得
const args: [string, string] = process.argv.slice(2) as [string, string];

if (args.length !== 2) {
  console.log('Usage: node script.js <directory> <csvFilePath>');
  process.exit(1);
}

const [directory, csvFilePath] = args;

renameFiles(directory, csvFilePath);