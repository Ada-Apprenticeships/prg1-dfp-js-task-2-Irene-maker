const fs = require('fs');

function parseFile(indata, outdata, delimiter = ';') {
  if (!fs.existsSync(indata)) {
    return -1; // Return -1 if the input file doesn't exist
  }

  if (fs.existsSync(outdata)) {
    fs.unlinkSync(outdata);
  }

  const data = fs.readFileSync(indata, 'utf-8');
  const lines = data.split(/\n/);

  // Checks only the first line for headers
  let hasHeader = false;
  if (lines.length > 0) {
    const firstLineParts = lines[0].trim().split(delimiter);
    if (firstLineParts[0].toLowerCase() === 'review' && firstLineParts[1].toLowerCase() === 'sentiment') {
      hasHeader = true;
    }
  }

  // Start processing lines depending on whether there is a header
  const startIndex = hasHeader ? 1 : 0;
  const validResult = lines.slice(startIndex).reduce((accum, line) => {
    const trimmedLine = line.trim();
    if (trimmedLine === '') return accum; // Skip empty lines

    const parts = trimmedLine.split(delimiter);
    if (parts.length < 2) {
      console.log("Skipping invalid line (missing sentiment or review):", line); 
      return accum; /*added line to console to improve clarity/provide data context to reader */
    }

    const truncatedReview = parts[0].length > 20 ? parts[0].substring(0, 20) : parts[0];
    accum.push(`${parts[1].trim()}${delimiter}${truncatedReview}`);
    return accum;
  }, []);

  const csvContent = validResult.join('\n') + '\n';
  fs.writeFileSync(outdata, csvContent, 'utf8');
  return validResult.length;
}

console.log(parseFile("./datafile.csv","./outputfile.csv",";"));


  

// Leave this code here for the automated tests
module.exports = {
  parseFile,
}