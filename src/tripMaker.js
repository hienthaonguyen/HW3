const getWeather = require('./weather')

// import the functions from modules 
const generateLocations = require('./location')
const generateTrip = require('./trip')


/*
    This function accepts a list of addresses and invoke the generateLocations, 
    generateTrip functions and finally the getWeather function on the final stop of the trip
 */


const makeMyTrip = (addr, callback) => {
    generateLocations(addr, (locErr, locData)=>{
        // generating the object of location, in this case we use the callback function in the asynchronous function
        // if error, let the user know
        if (locErr){
            callback('Error. Could not get the trip', undefined)
        }
        // if not, show the detail of the trip
        else {
            generateTrip(locData, (tripErr, tripData) => {
                if (tripErr){
                    callback('Error. Could not get the trip', undefined)
                }
                else {
                    getWeather(locData[locData.length - 1], (weatherErr, weatherData)=> {
                        if (weatherErr){
                            callback('Error. Could not get the trip', undefined)
    
                        }
                        else {
                            tripData.weather = weatherData
                            callback(undefined, tripData)
                        }
                    })
                }
               
            })
        }
       
        
    })
}
// export the makeMyTrip module
module.exports = makeMyTrip