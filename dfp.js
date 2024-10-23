const fs = require('fs');


function parseFile (indata, outdata, delimiter = ';') {
  
  if (!fs.existsSync(indata)) {
    return -1; // Return -1 if the input file doesn't exist
  }
  
  if (fs.existsSync(outdata)) {
    fs.unlinkSync(outdata);
  }
  
  const data = fs.readFileSync(indata, "utf-8");
  const lines = data.split(/\n/);

  // Variable to track whether we found a header
  let hasHeader = false;
  
  const result = lines.map(line => {
    const trimmedLine = line.trim();
    const parts = trimmedLine.split(delimiter);

    // skip empty lines
    if (trimmedLine === '') {
      return null;
    }

    // Make sure we have both a review and a sentiment
    if (parts.length < 2) {
      console.log("Skipping invalid line (missing sentiment or review):", line);
      return null; // Return null for invalid lines
    }

    // Identify header
    if (!hasHeader && parts[0].toLowerCase() === 'review' && parts[1].toLowerCase() === 'sentiment') {
      hasHeader = true; // Mark that we've seen a header
      return null; // Do not include the header in the result
    }
    
    // I have added '...' to indicate trauncation to the reader
    const truncatedReview = parts[0].length > 20 ? parts[0].substring(0, 20) : parts[0];
    return  `${parts[1].trim()}${delimiter}${truncatedReview}\n`
  });

  // Filter out empty strings caused by malformed or invalid lines 
  const validResult = result.filter(item => item !== null);
  const exportedCount = validResult.length;
  const csvContent = validResult.join();
  // included 'utf8' to specify the encoding of the file
  fs.writeFileSync(outdata, csvContent, 'utf8');
  return exportedCount;
}

  // const fs = require('fs');

  // function parseFile(indata, outdata, delimiter = ';') {
  //   if (!fs.existsSync(indata)) {
  //     return -1; // Return -1 if the input file doesn't exist
  //   }
  
  //   if (fs.existsSync(outdata)) {
  //     fs.unlinkSync(outdata);
  //   }
  
  //   const data = fs.readFileSync(indata, "utf-8");
  //   const lines = data.split(/\n/);
  
  //   let hasHeader = false;
  
  //   const validResult = lines.reduce((accum, line) => {
  //     const trimmedLine = line.trim();
  //     if (trimmedLine === '') return accum;
  
  //     const parts = trimmedLine.split(delimiter);
  
  //     if (parts.length < 2) {
  //       console.log("Skipping invalid line (missing sentiment or review):", line);
  //       return accum;
  //     }
  
  //     if (!hasHeader && parts[0].toLowerCase() === 'review' && parts[1].toLowerCase() === 'sentiment') {
  //       hasHeader = true;
  //       return accum;
  //     }
  
  //     const truncatedReview = parts[0].length > 20 ? parts[0].substring(0, 20) : parts[0];
  //     accum.push(`${parts[1].trim()}${delimiter}${truncatedReview}`);
  //     return accum;
  //   }, []);
  
  //   const csvContent = validResult.join('\n') + '\n';
  //   fs.writeFileSync(outdata, csvContent, 'utf8');
  //   return validResult.length;
  // }

console.log(parseFile("./datafile.csv","./outputfile.csv",";"));


  

// Leave this code here for the automated tests
module.exports = {
  parseFile,
}