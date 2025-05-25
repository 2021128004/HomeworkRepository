const csv = require('csvtojson');
const fs = require('fs');
const path = require('path');

const inputCsv = path.join(__dirname, 'movies.csv');
const outputJson = path.join(__dirname, 'movie.json');

csv()
    .fromFile(inputCsv)
    .then((jsonObj)=>{
        fs.writeFileSync(outputJson, JSON.stringify(jsonObj, null, 2), 'utf8');
        console.log('success');
    })
    .catch(err => {
        console.error('error: ', err);
    })