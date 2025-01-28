import "./styles.css"
const searchBox = document.getElementById("search-bar")
let apiKey = "MLFQJEEBN6KDXRQZ5Z88HFVFJ"
let button = document.getElementById("btn")

async function getData() {
  // const query = searchBox.value.trim().toLowerCase()
  const query = "trujillo"
  if (!query) {
    alert("Please enter a location!")
    return
  }

  try {
    const response = await fetch(
      `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${query}?key=${apiKey}`,
    )

    const data = await response.json()
    console.log(data) // Current day
    console.log(data) // Current date
    console.log(data) // Temp
    console.log(data) // High
    console.log(data) // Low
    console.log(data) // Status
    console.log(data) // Feels like
  } catch (err) {
    console.error(err)
  }
}

button.addEventListener("click", () => getData())

function displayWeatherInfo(data) {}
function displayEmoji() {}
function displayError() {}
