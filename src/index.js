import "./styles.css"
import "@fortawesome/fontawesome-free/js/fontawesome"
import "@fortawesome/fontawesome-free/js/solid"
import "@fortawesome/fontawesome-free/js/regular"
import "@fortawesome/fontawesome-free/js/brands"
import snowImage from "../src/img/snow.png"
import rainImage from "../src/img/rain.png"
import fogImage from "../src/img/fog.png"
import windImage from "../src/img/wind.png"
import cloudyImage from "../src/img/cloudy.png"
import partlyCloudyDayImage from "../src/img/partly-cloudy-day.png"
import partlyCloudyNightImage from "../src/img/partly-cloudy-night.png"
import clearDayImage from "../src/img/clear-day.png"
import clearNightImage from "../src/img/clear-night.png"

let apiKey = "MLFQJEEBN6KDXRQZ5Z88HFVFJ"
const button = document.getElementById("btn")
const toggle = document.getElementById("temperatureToggle")
const searchBox = document.getElementById("search")

button.addEventListener("click", async () => {
  const city = searchBox.value.trim().toLowerCase()
  if (city) {
    try {
      const weatherData = await getData(city)
      console.log(weatherData)

      displayWeatherInfo(weatherData)
      displayIcons(weatherData)
      changeTemp(weatherData)
    } catch (error) {
      console.log(error)
    }
  } else {
    alert("Please enter a city")
  }
})

document.addEventListener("DOMContentLoaded", async () => {
  const weatherData = await getData()
  displayWeatherInfo(weatherData)
  displayIcons(weatherData)

  changeTemp(weatherData)
})

async function getData(city = "Trujillo") {
  if (!city) {
    alert("Please enter a location!")
    return
  }

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}?key=${apiKey}`,
    )

    const time = new Date().toLocaleTimeString()
    const hour = time.split(" ")[0].split(":")[0]

    const data = await response.json()
    const currentDay = getDate()

    const dataObj = {
      // Main section
      currentHour: hour,
      location: data.address,
      icon: data.currentConditions.icon,
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
    console.log(data)
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

function getRightUnits(boolean, value) {
  if (boolean) {
    return fahrenheitToCelsius(value)
  } else {
    return celsiusToFahrenheit(value)
  }
}

function changeTemp(data) {
  const temp = document.getElementById("temp")
  const high = document.getElementById("high")
  const low = document.getElementById("low")
  const feelsLike = document.getElementById("feelsLike")
  const tomorrowTemp = document.getElementById("tomorrowTemp")
  const weekTemps = document.querySelectorAll(".thisWeekTemp")

  toggle.addEventListener("change", function () {
    // Check if the checkbox is checked
    if (toggle.checked) {
      console.log("C") // Checkbox is checked, so it's 'C'
      temp.innerHTML = `${getRightUnits(toggle.checked, data.temp)}` // has to change
      high.innerHTML = `${getRightUnits(toggle.checked, data.high)}` // has to change
      low.innerHTML = `${getRightUnits(toggle.checked, data.low)}` // has to change
      feelsLike.innerHTML = `${getRightUnits(toggle.checked, data.feelslike)}` // has to change
      tomorrowTemp.innerHTML = `${getRightUnits(toggle.checked, data.tomorrow.temp)}` // has to change

      let i = 0
      for (let weekTemp of weekTemps) {
        weekTemp.innerHTML = Math.round(
          getRightUnits(toggle.checked, data.week[i].temp),
        )
        i++
      }

      changePrefix()
    } else {
      console.log("F") // Checkbox is unchecked, so it's 'F'
      temp.innerHTML = `${getRightUnits(toggle.checked, data.temp)}` // has to change
      high.innerHTML = `${getRightUnits(toggle.checked, data.high)}` // has to change
      low.innerHTML = `${getRightUnits(toggle.checked, data.low)}` // has to change
      feelsLike.innerHTML = `${getRightUnits(toggle.checked, data.feelslike)}` // has to change
      tomorrowTemp.innerHTML = `${getRightUnits(toggle.checked, data.tomorrow.temp)}` // has to change
      let i = 0
      for (let weekTemp of weekTemps) {
        weekTemp.innerHTML = Math.round(
          getRightUnits(toggle.checked, data.week[i].temp),
        )
        i++
      }

      changePrefix()
    }
  })
}

function changePrefix() {
  const prefixes = document.querySelectorAll(".prefix")
  const flag = toggle.checked

  for (let prefix of prefixes) {
    prefix.innerHTML = flag ? "°C" : "°F"
  }
}

function fahrenheitToCelsius(fahrenheit) {
  let celsius = (fahrenheit - 32) / (9 / 5)
  return Math.round(celsius * 10) / 10
}

function celsiusToFahrenheit(celsius) {
  let fahrenheit = celsius * (9 / 5) + 32
  return Math.round(fahrenheit * 10) / 10
}

function tConvert(time) {
  // Check correct time format and split into components
  time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [
    time,
  ]

  if (time.length > 1) {
    // If time format correct
    time = time.slice(1) // Remove full string match value
    time[0] = +time[0] % 12 || 12 // Adjust hours
  }
  return time.join("") // return adjusted time or original string
}

function displayWeatherInfo(data) {
  const location = document.getElementById("location")
  const currentDay = document.getElementById("weekday")
  const currentDate = document.getElementById("date")
  const temp = document.getElementById("temp")
  const high = document.getElementById("high")
  const low = document.getElementById("low")
  const status = document.getElementById("status")
  const feelsLike = document.getElementById("feelsLike")
  const chanceOfRain = document.getElementById("chanceOfRain")
  const uvIndex = document.getElementById("uvIndex")
  const windStatus = document.getElementById("wind")
  const humidity = document.getElementById("humidity")
  const tomorrowStatus = document.getElementById("tomorrowStatus")
  const tomorrowTemp = document.getElementById("tomorrowTemp")
  const sunrise = document.getElementById("sunrise")
  const sunset = document.getElementById("sunset")
  const lengthOfDay = document.getElementById("lengthOfDay")

  const weekTemps = document.querySelectorAll(".thisWeekTemp")
  const weekDays = document.querySelectorAll(".thisWeek")
  const weekIcons = document.querySelectorAll(".thisWeekIcon")

  let i = 0
  let x = 1
  let z = 0

  for (let weekTemp of weekTemps) {
    weekTemp.innerHTML = Math.round(
      getRightUnits(toggle.checked, data.week[i].temp),
    )
    i++
  }

  for (let weekIcon of weekIcons) {
    weekIcon.src = getWeatherIcon(data.week[z++].icon)
  }

  for (let i = 0; i < weekDays.length; i++) {
    if (i === 0) {
      weekDays[i].innerHTML = "Today"
      continue
    }

    weekDays[i].innerHTML = new Date(data.week[++x].datetime)
      .toLocaleString("en-us", {
        weekday: "long",
      })
      .substring(0, 3)

    x++
  }

  location.innerHTML = data.location
  currentDay.innerHTML = data.dayResponse.weekDay
  const dateStr = `${data.dayResponse.dayNum} ${data.dayResponse.month}, ${data.dayResponse.year}`
  currentDate.innerHTML = dateStr
  temp.innerHTML = `${getRightUnits(toggle.checked, data.temp)}` // has to change
  high.innerHTML = `${getRightUnits(toggle.checked, data.high)}` // has to change
  low.innerHTML = `${getRightUnits(toggle.checked, data.low)}` // has to change
  status.innerHTML = data.status
  feelsLike.innerHTML = `${getRightUnits(toggle.checked, data.feelslike)}` // has to change
  chanceOfRain.innerHTML = `${Math.round(data.chanceOfRain)}%`
  uvIndex.innerHTML = `${data.uvIndex}`
  windStatus.innerHTML = `${data.windStatus}`
  humidity.innerHTML = `${data.humidity}`
  sunrise.innerHTML = `${data.sunrise.slice(1).substring(0, 4)}`
  sunset.innerHTML = `${tConvert(data.sunset).substring(0, 4)}`
  lengthOfDay.innerHTML = `${data.lengthOfDay.hours}h ${data.lengthOfDay.minutes}m`
  tomorrowStatus.innerHTML = data.tomorrow.conditions
  tomorrowTemp.innerHTML = `${getRightUnits(toggle.checked, data.tomorrow.temp)}` // has to change
}

function displayIcons(data) {
  const bigWeatherIcon = document.getElementById("bigWeatherIcon")
  const tomorrowIcon = document.getElementById("tomorrowIcon")
  const todayIcons = document.querySelectorAll(".todayIcon")

  for (let icon of todayIcons) {
    icon.src = getWeatherIcon(data.icon)
  }
  bigWeatherIcon.src = getWeatherIcon(data.icon)
  tomorrowIcon.src = getWeatherIcon(data.tomorrow.icon)
}

function getWeatherIcon(icon) {
  let img = null
  switch (icon) {
    case "snow":
      img = snowImage
      break
    case "rain":
      img = rainImage
      break
    case "fog":
      img = fogImage
      break
    case "wind":
      img = windImage
      break
    case "cloudy":
      img = cloudyImage
      break
    case "partly-cloudy-day":
      img = partlyCloudyDayImage
      break
    case "partly-cloudy-night":
      img = partlyCloudyNightImage
      break
    case "clear-day":
      img = clearDayImage
      break
    case "clear-night":
      img = clearNightImage
      break
    default:
      console.log("error in switch")
      break
  }
  return img
}
function displayError() {}
