const express = require('express')

const makeMyTrip = require('./src/tripMaker')

const app = express()
const path = require('path');
const port = 3000;
app.listen(port)
console.log("Starting server on Port 3000")

app.use(express.urlencoded({ extended: true })); // this middleware is essential for express to parse data coming in from post requests
app.use(express.static(path.join(__dirname, 'public'))) //this middleware tells express where to serve static assets from
app.set('views', path.join(__dirname, 'views')) // this tells express where to look for templates when using res.render
app.set('view engine', 'ejs') // this tells express what tempalte engine to use eg. pug,hbs ejs etc.

//home route
app.get('/', (req, res) => {
    // render the index.ejs file
    res.render('index')
})

// trip route with get method
app.get('/trip', (req, res) => {

    // create the variable 
    let result = ""
    let isError = false
    const addrList = req.query.txtLocations.split(',')


    // This is the way that render the new page - trip.ejs 
    // call makeMyTrip function from TripMaker module
    // makeMyTrip(addrList, (tripErr, tripData)=>{

    // if there is an error, execute on the screen and let the user know
    if (tripErr) {
        result = tripErr
        isError = true
        res.render('trip', { weatherResult: result, isError: isError })
    }
    // if not, show the result
    else {
        result = `It is currently ${tripData.weather.temp} degrees in ${addrList[addrList.length - 1]}. It feels like ${tripData.weather.real}`
        res.render('trip', { weatherResult: result, result: tripData, isError: isError })

    }



    /* 
        EXTRA CREDIT: this is the method use the same index page without reloading the page
    */
    makeMyTrip(addrList, (tripErr, tripData) => {
        if (tripErr) {
            result = "Error. Cannot get the trip information"
            isError = true
            res.send({ weatherResult: result, isError: isError })
        }
        else {
            result = `It is currently ${tripData.weather.temp} degrees in ${addrList[addrList.length - 1]}. It feels like ${tripData.weather.real} degrees`
            res.send({ result: tripData, weatherResult: result, isError: isError })

        }
    })
})







/* Basic 404 response*/
app.get('/*', (req, res) => {
    res.status(404)
    res.type('txt')
    res.write("Oops, this page does not exist")
    res.send()
})
