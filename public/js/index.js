// function is used to convert section to day, hour, min, sec
const convertTime = (sec) => {
    sec = Number(sec);
    let d = Math.floor(sec / (3600 * 24));
    let h = Math.floor(sec % (3600 * 24) / 3600);
    let m = Math.floor(sec % 3600 / 60);
    let s = Math.floor(sec % 60);

    let dDisplay = d > 0 ? d + (d == 1 ? " day " : " days ") : "";
    let hDisplay = h > 0 ? h + (h == 1 ? " hour " : " hours ") : "";
    let mDisplay = m > 0 ? m + (m == 1 ? " minute, " : " minutes ") : "";
    let sDisplay = s > 0 ? s + (s == 1 ? " second" : " seconds") : "";
    return dDisplay + hDisplay + mDisplay + sDisplay;

}
// function used to convert meter to miles 
const convertToMile = (meter) => {
    return Math.round(meter * 0.000621 * 100) / 100
}

const div = document.querySelector('#weatherSection')
const btnSubmit = document.querySelector('#btnSubmit')
const txtLocations = document.querySelector("#txtLocations")

btnSubmit.addEventListener('click', (e) => {
    // stop the auto reload of the submit button
    e.preventDefault()

    // fetch the data from our server
    fetch('/trip/?txtLocations=' + txtLocations.value)
        .then((response) => response.json())
        .then((weatherData) => {

            console.log(weatherData)
            // create the h3 element 
            const result = document.createElement('h3')

            // check if the data does not return error, then show the summary trip on the screen
            if (!weatherData.isError) {

                // query the div section in html
                const summarySection = document.querySelector('#summarySection')
                // change the display style to block
                summarySection.style.display = "block"

                // create and query some essential html element
                const summaryStop = document.createElement('h2')
                const orderedList = document.createElement('ol')
                const totalDistance = document.querySelector('.tDistance')
                const totalTime = document.querySelector('.tTime')


                // change the content of the h2 element
                summaryStop.textContent = "Summary Stops"

                // chnange the text content of two p elements to show the total distance and total time
                totalDistance.textContent = convertToMile(weatherData.result.distance)
                totalTime.textContent = convertTime(weatherData.result.duration)


                for (let leg of weatherData.result.legs) {
                    // create the HTML elements (list, paragraphs)
                    const li = document.createElement('li')
                    const start = document.createElement('p')
                    const stop = document.createElement('p')
                    const distance = document.createElement('p')
                    const time = document.createElement('p')

                    // assign all necessary data to the p element
                    start.textContent = `Start: ${leg.start.name}`
                    stop.textContent = `Stop: ${leg.stop.name}`
                    distance.textContent = `Distance: ${convertToMile(leg.distance)} miles`
                    time.textContent = `Time: ${convertTime(leg.duration)}`

                    // append the paragraph to the list element
                    li.appendChild(start)
                    li.appendChild(stop)
                    li.appendChild(distance)
                    li.appendChild(time)

                    // add the li element to ol element
                    orderedList.appendChild(li)
                    console.log(start)
                }

                // append the elements created in this js to the DOM 
                summarySection.appendChild(summaryStop)
                summarySection.appendChild(orderedList)


            }

            // if there is an error
            else {

                // change the text color to red
                result.style.color = "red"

            }

            // show the degree of the last place or error
            result.textContent = weatherData.weatherResult
            div.appendChild(result)
        })
})
