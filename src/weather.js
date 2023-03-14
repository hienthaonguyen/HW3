const request = require('request')

const getWeather = (location, callback)=>{
    const weatherPrefix = "https://api.openweathermap.org/data/2.5/weather"
    const weatherKey = "4f6ab7ac829d133e80db0f4115e3e58a"
    const url = `${weatherPrefix}?lat=${location.lat}&lon=${location.lon}&appid=${weatherKey}&units=imperial`

    request.get(url, (err, res)=>{
        if (err) {
            callback(`Error. Could not get the weather for ${location.name}`, undefined)
        }
        else {
            const data = JSON.parse(res.body)
            callback(undefined, {
                temp: data.main.temp, 
                real: data.main.feels_like
            })

        }
    })
}
module.exports = getWeather
