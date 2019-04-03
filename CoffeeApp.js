const fs = require('fs'); 
const csv = require('fast-csv');
var obj = csv();

const readline = require('readline');
const rdl= readline.createInterface(process.stdin, process.stdout);

var longi;
var lati;
var file;
var latitude = [];
let longitude = [];
let location = [];
var ct = 0;

rdl.question("Datele: ", function(data){
    let elementss = data.split(',');
    longi = elementss[0];
    lati = elementss[1];
    file = elementss[2];
    let value;

    function interpretation(value) {
        location=[...location, `${value[0]}`];
        latitude=[...latitude, `${value[1]}`];
        longitude=[...longitude, `${value[2]}`];
    }

    let lat1, lon1, lat2, lon2;

    function getDistance(lat1,lon1,lat2,lon2) {
        var R = 6371; // Radius of the earth in km
        var dLat = deg2rad(lat2-lat1);  // deg2rad below
        var dLon = deg2rad(lon2-lon1); 
        var a = 
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * 
          Math.sin(dLon/2) * Math.sin(dLon/2); 
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
        var d = R * c; // Distance in km
        return d;

    } 
    
    function deg2rad(deg) {
        return deg * (Math.PI/180)
    }

    var sort_by = function(field, reverse, primer){

        var key = primer ? 
            function(x) {return primer(x[field])} : 
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        } 
    }
    function showLocations() {
        let result = [];
        let result1= [];
        let distance = [];
   	
        for(let i=0; i<location.length; i++){
            distance= [...distance, getDistance(longi,lati,latitude[i],longitude[i])];
        }
        for(let i=0; i<location.length; i++){
            result.push({location: `${location[i]}`, distance: `${distance[i]}`})
        }
        resultSorted= result.sort(sort_by('distance', false, parseInt));

        for(let i=0;i<3;i++){
            console.log(`${resultSorted[i]['location']}, ${resultSorted[i]['distance']}`);
         }
    }

    
    fs.createReadStream(`${file}`)  
        .pipe(csv())
        .on('data', (row) => {
            interpretation(row);
            ct++;
             if ( ct === 6 ) {
                 showLocations();
             }
         })
        .on('end', () => {
             console.log('CSV file successfully processed!');
         });
}); 