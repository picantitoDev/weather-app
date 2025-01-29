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
    const dataObj = {
      temp: data.days[0].hours[hour].temp,
      high: data.days[0].tempmax,
      low: data.days[0].tempmin,
      status: data.currentConditions.conditions,
      feelslike: data.currentConditions.feelslike,
    }
    const obj = getDate()
    console.log(obj)
    console.log(dataObj)
    return dataObj
  } catch (err) {
    console.error(err)
  }
}

function getDate() {
  let date = new Date()

  const f = new Intl.DateTimeFormat("en-us", {
    dateStyle: "full",
  })

  const str = JSON.stringify(f.format(date)).replace(/^"|"$/g, "").split(",")
  const weekDay = str[0]
  const day = str[1].trim().split(" ")
  const month = day[0].substring(0, 3)
  const dayNum = day[1]
  const year = str[2]

  const dateObj = {
    weekDay: weekDay,
    month: month,
    dayNum: dayNum,
    year: year,
  }
  return dateObj
}

button.addEventListener("click", () => getData())

function displayWeatherInfo(data) {}
function displayEmoji() {}
function displayError() {}
