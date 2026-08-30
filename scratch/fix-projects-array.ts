import fs from 'fs';

let content = fs.readFileSync('lib/real-romanian-data.ts', 'utf-8');

// Find the last ];
const lastClose = content.lastIndexOf('];');
if (lastClose !== -1) {
  // Check if there is another ]; before it
  const secondLastClose = content.lastIndexOf('];', lastClose - 1);
  if (secondLastClose !== -1) {
    // Replace the secondLastClose with a comma
    content = content.slice(0, secondLastClose) + ',\n' + content.slice(secondLastClose + 2);
    fs.writeFileSync('lib/real-romanian-data.ts', content, 'utf-8');
    console.log('Successfully fixed realProjectsDataset array!');
  }
}
