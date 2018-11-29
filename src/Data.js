import formatForId from './Helpers';
import getTime from 'date-fns/get_time';
import moment from 'moment';

const sheetUrl = 'https://sheets.googleapis.com/v4/spreadsheets/1nkWGffX9Kly0vKkNJ9WrK402R3zfD3X1uWmQMCwEm6E/values:batchGet?majorDimension=ROWS&ranges=Sheet1&key=AIzaSyATGoCmjauj84MNSkIAM5aV4HrBueekcJ4';

const structureData = data => {
    console.log(data)
    const headlinesArray = data.valueRanges[0].values.slice(1);
    const publicationArray = [...new Set(headlinesArray.map(value => value[0]))]
    console.log(publicationArray)
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
console.log(formattedArray)
    return {
        publications, 
        formattedArray,
        timesArray
    };
}

const getData = fetch(sheetUrl).then(resp => resp.json()).then(structureData);

export default getData;