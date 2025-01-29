import { isInteger, toInteger } from "lodash"
import "./styles.css"
const searchBox = document.getElementById("search-bar")
let apiKey = "MLFQJEEBN6KDXRQZ5Z88HFVFJ"
let button = document.getElementById("btn")

async function getData() {
  // const query = searchBox.value.trim().toLowerCase()
  const query = "Trujillo"
  if (!query) {
    alert("Please enter a location!")
    return
  }

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${apiKey}`,
    )

    const time = new Date().toLocaleTimeString()
    const hour = time.split(" ")[0].split(":")[0]

    const data = await response.json()
    console.log(data)

    // Main section
    // Aside section
    // Bottom Left section
    //
    console.log("Day: " + getDate()) // Current day
    console.log("January 28") // Current date
    console.log("Temp in F " + data.days[0].hours[hour].temp) // Temp
    console.log("TempMax in F " + data.days[0].tempmax) // HIGH
    console.log("TempMin in F " + data.days[0].tempmin) // LOW
    console.log("Status: " + data.currentConditions.conditions) // Status
    console.log("Feels Like: " + data.currentConditions.feelslike) // Feels like
  } catch (err) {
    console.error(err)
  }
}

function getDate() {
  let date = new Date()

  const day = date.getDate()
  const month = date.getMonth()
  const year = date.getFullYear()
  return `${day} ${month}, ${year}`
}

button.addEventListener("click", () => getData())

function displayWeatherInfo(data) {}
function displayEmoji() {}
function displayError() {}
