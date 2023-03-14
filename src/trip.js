const request = require('request')

// the following function is used to generate the url from the mapbox api
const generateURL = (locations) => {
    const mapPrefix = "https://api.mapbox.com/directions/v5/mapbox/driving/"
    const mapKey = "pk.eyJ1IjoiaHRuZ3V5ZW4iLCJhIjoiY2xlNXdsaTU0MDBnZzNvbXlreXUxem03cCJ9.V8JrUp8MOanFcNTpylTsSQ"
    let cordinate=""

    // iterate through the locations array to get the coordinates like lat and lon
    locations.forEach((l,i)=>{
        if (i < locations.length-1){
            cordinate += `${l.lon}%2C${l.lat}%3B`
        }
        else {
            cordinate += `${l.lon}%2C${l.lat}`
        }
    })

    // create and assign approriate url 
    const url = `${mapPrefix}${cordinate}?alternatives=false&geometries=geojson&language=en&overview=simplified&steps=true&access_token=${mapKey}`
   
    return url
}


// main function 
const generateTrip = (locations, callback) => {
    // get url 
    const url = generateURL(locations)

    // create an empty object
    let tripObj = {}

    // use request.get() to get the data.
    // request.get() is an asynchronous function, so we must use call back function to store the data
    request.get(url, (err, res)=>{
        if (err){
            callback('Error. Could not get the trip', undefined)
        }
        else {
            const data = JSON.parse(res.body)
            const routes = data.routes[0]
           
            // pass duration and distance values from the JSON file fetched from mapbox api to the local object
            tripObj={
                duration: routes.duration,
                distance: routes.distance,
                legs: []
            }
            
            // iterate through the legs array of the object from mapbox
            routes.legs.forEach((d,idx)=>{

                // push all necessary data to our legs array in tripObj
                tripObj.legs.push({
                    idx: idx,
                    start: locations[idx],
                    stop: locations[idx+1],
                    distance: d.distance, 
                    duration: d.duration,
                    summary: d.summary
                })
            })
            
            callback(undefined, tripObj)


        }
    })
    
}

// export this function
module.exports = generateTrip