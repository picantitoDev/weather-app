import "./styles.css"
import "@fortawesome/fontawesome-free/js/fontawesome"
import "@fortawesome/fontawesome-free/js/solid"
import "@fortawesome/fontawesome-free/js/regular"
import "@fortawesome/fontawesome-free/js/brands"

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
    const currentDay = getDate()

    const dataObj = {
      // Main section
      dayResponse: currentDay,
      temp: data.days[0].hours[hour].temp,
      high: data.days[0].tempmax,
      low: data.days[0].tempmin,
      status: data.currentConditions.conditions,
      feelslike: data.currentConditions.feelslike,
      // Aside section
      chanceOfRain: data.days[0].precipprob,
      uvIndex: data.days[0].uvindex,
      windStatus: data.days[0].windspeed,
      humidity: data.days[0].humidity,
      // Bottom Left
      today: data.days[0].hours,
      tomorrow: data.days[1],
      week: data.days,

      // Bottom mid
      sunrise: data.days[0].sunrise,
      sunset: data.days[0].sunset,
      lengthOfDay: calculateDayLength(
        data.days[0].sunrise,
        data.days[0].sunset,
      ),
    }
    return dataObj
  } catch (err) {
    console.error(err)
  }
}

function timeStringToDate(timeString) {
  const [hours, minutes, seconds] = timeString.split(":").map(Number)
  const date = new Date()
  date.setHours(hours, minutes, seconds, 0)
  return date
}

function calculateDayLength(sunrise, sunset) {
  const sunriseDate = timeStringToDate(sunrise)
  const sunsetDate = timeStringToDate(sunset)

  const differenceInMilliseconds = sunsetDate - sunriseDate
  const differenceInSeconds = Math.floor(differenceInMilliseconds / 1000)
  const hours = Math.floor(differenceInSeconds / 3600)
  const minutes = Math.floor((differenceInSeconds % 3600) / 60)
  const seconds = differenceInSeconds % 60

  const day = {
    hours: hours,
    minutes: minutes,
    seconds: seconds,
  }

  return day
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

async function displayWeatherInfo() {
  const data = await getData()
  console.log(data)
}

button.addEventListener("click", () => displayWeatherInfo())
function displayEmoji() {}
function displayError() {}
