import formatForId from '../Helpers';
import getTime from 'date-fns/get_time';
import moment from 'moment';
import fetch from 'node-fetch';
import dotenv from 'dotenv'
dotenv.config()

const { SHEETS_NAME, SHEETS_API_KEY } = process.env;


const sheetUrl = `https://sheets.googleapis.com/v4/spreadsheets/${SHEETS_NAME}/values:batchGet?majorDimension=ROWS&ranges=Sheet1&key=${SHEETS_API_KEY}`;
console.log(sheetUrl);

exports.handler = function(event, context, callback) {
    
const structureData = data => {
    const headlinesArray = data.valueRanges[0].values.slice(1);
    const publicationArray = [...new Set(headlinesArray.map(value => value[0]))]
    const publications = publicationArray.map(value => ({
      [formatForId(value)]: value
    }));
    
    const formattedArray = publications.reduce((map, publicationObj) => {
      const pubKey = Object.keys(publicationObj)[0];
      const headlinesForPub = headlinesArray
        .filter(headlineRow => formatForId(headlineRow[0]) === pubKey)
        .map(headlineRow =>   
          ({
            date: headlineRow[1],
            isoDate: getTime(moment(headlineRow[1])),
            date: headlineRow[1],
            headline: headlineRow[2]
          })
      );

      map[pubKey] = {
        pubTitle: publicationObj[pubKey],
        headlines: headlinesForPub.map((headlineObj, i) => Object.assign(headlineObj, {prevHeadline: headlinesForPub[i-1] && headlinesForPub[i-1].headline || ''}, {}))
      };
      console.log(map)
      return map;

      // Returns {publicationID: { pubTitle: '', headlines: [ { headline: '', date: '' }]}}
    }, {});

    const timesArray = formattedArray.latestbreakingnewsav.headlines.map(vals => vals.isoDate)

    return {
        publications, 
        formattedArray,
        timesArray
    };
}

fetch(sheetUrl).then(resp => resp.json()).then(data => {
    callback(null, {
        "isBase64Encoded": false,
        "statusCode": 200,
        "headers": { "X-Gareth-Header": "Garethheadervalue" },
        "body": JSON.stringify(structureData(data))
    })
});

    
}
