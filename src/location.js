const request = require('request')

// create some global variables
let locArray = []
let locObj = {}

const generateLocations = (addrList, callback) => {
    const locPrefix = "https://api.mapbox.com/geocoding/v5/mapbox.places"
    const locKey = "pk.eyJ1IjoiaHRuZ3V5ZW4iLCJhIjoiY2xlNXdsaTU0MDBnZzNvbXlreXUxem03cCJ9.V8JrUp8MOanFcNTpylTsSQ"

    // condition is used to check if the user enter more than one locations or not
    // if not, gives error
    // if yes, gives object
    if (addrList.length === 0 || addrList.length === 1){
        callback("Error. Could not get the location", undefined)
    }
    else {

        // iterates through the list of places
        addrList.forEach((address, idx)=> {

            // generate the url 
            const url =`${locPrefix}/${address}.json?proximity=ip&access_token=${locKey}`
    
            // use request module to fetch data from mapbox api
            request.get(url, (err, res) => {
                // if the url doesnot exist, execute the error
                if (err){
                    callback(`Error. Could not get the trip`, undefined)
                }

                // if not, execute the data from the next module
                else {
                    const data = JSON.parse(res.body)
                    
                    locObj = {
                        idx: idx,      
                        lon:data.features[0].center[0],   
                        lat:data.features[0].center[1],
                        name: data.features[0].place_name
                    }
                   
                    // store locObj to locArray
                    locArray.push(locObj)
                    // sort the location by the index
                    locArray.sort((a,b) => a.idx - b.idx )
                    if (addrList.length === locArray.length){
                        // store the array by using callback function
                        callback(undefined, locArray)}
        
                }
        
            })
        })
    }
    
    
}

// export the location module
module.exports=generateLocations