// DOM elements needed
const degree = document.getElementById("currentTempSection");
const currentTemp = document.getElementById("degree");
const degreeScale = document.querySelector("span");
const cTemp = document.getElementById("celsius");
const fTemp = document.getElementById("fahrenheit");

const day = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const month = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

window.addEventListener("load", () => {
  let longitude;
  let latitude;

  // Get the latitude and longitude of the user's location
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition((position) => {
      longitude = position.coords.longitude;
      latitude = position.coords.latitude;

      // To avoid the cors issue, run the API through a proxy
      const proxy = "https://cors-anywhere.herokuapp.com/";
      const api = `${proxy}https://api.darksky.net/forecast/ef062569720f0a4a50be50c0492a8d82/${latitude},${longitude}`;

      // Fetch the weather information from the Dark Sky API server
      fetch(api)
        .then((response) => {
          return response.json();
        })
        .then((data) => {
          console.log(data);

          // JSON data
          const {
            temperature,
            summary,
            icon,
            humidity,
            windSpeed,
            precipProbability,
            pressure,
          } = data.currently;

          // UNIX time formatted to be able to display
          let timeStamp = new Date(data.currently.time * 1000);
          let forecastDate = `${
            day[timeStamp.getDay()]
          } ${timeStamp.getDate()} ${
            month[timeStamp.getMonth()]
          }, ${timeStamp.getFullYear()}`;

          // Set DOM elements to JSON/API data
          document.getElementById("date").textContent = forecastDate;
          document.getElementById("location").textContent = data.timezone;
          document.getElementById("degree").textContent = Math.floor(
            temperature
          );
          document.getElementById("description").textContent = summary;
          document.getElementById(
            "humidity"
          ).textContent = `Humidity: ${Math.floor(humidity * 100)}%`;
          document.getElementById(
            "wind"
          ).textContent = `Wind: ${windSpeed} mph`;
          document.getElementById(
            "precipitation"
          ).textContent = `Precipitation: ${precipProbability}%`;
          document.getElementById(
            "pressure"
          ).textContent = `Pressure: ${pressure} mb`;

          // Set and display the weather icon
          setIcon(icon, document.querySelector(".icon"));

          // Formula for converting Fahrenheit to Celsius
          let celsius = (temperature - 32) * (5 / 9);

          // Event listeners to change temperature to Celsius/Fahrenheit on click
          cTemp.addEventListener("click", () => {
            currentTemp.textContent = Math.floor(celsius);
          });

          fTemp.addEventListener("click", () => {
            currentTemp.textContent = Math.floor(temperature);
          });

          // Render the forecast tabs
          // document.getElementById('hourlyForecast').innerHTML = renderHourlyForecast(data.hourly);
          document.getElementById(
            "weeklyForecast"
          ).innerHTML = renderWeeklyForecast(data.daily);
        })
        .catch((err) => {
          throw `Sorry, an error occured. ${err}`;
        });
    });
  }

  // Render the weekly forecast
  function renderWeeklyForecast(forecastData) {
    let resultTable = `
            <tr>
                <th>Day</th>
                <th>Conditions</th>
                <th>Hi</th>
                <th>Lo</th>
            </tr>`;

    // Get 8 days of weather data
    rowCount = forecastData.data.length;
    if (forecastData > 8) {
      rowCount = 8;
    }

    // Loop over the data and add to a new row
    for (let i = 0; i < rowCount; i++) {
      let timeStamp = new Date(forecastData.data[i].time * 1000);

      let dayTime = day[timeStamp.getDay()];
      let summary = forecastData.data[i].summary;
      let tempHigh = `${Math.round(forecastData.data[i].temperatureHigh)}&deg`;
      let tempLow = `${Math.round(forecastData.data[i].temperatureLow)}&deg`;

      resultTable += renderRow(dayTime, summary, tempHigh, tempLow);
    }

    return resultTable;
  }

  // Add data to the new row
  function renderRow(dayTime, summary, tempHigh, colVal4) {
    return `<tr>
                    <td>${dayTime}</td>
                    <td>${summary}</td>
                    <td>${tempHigh}</td>
                    <td>${colVal4}</td>
                </tr>`;
  }

  function setIcon(icon, iconID) {
    const skycons = new Skycons({ color: "white" });
    const currentIcon = icon.replace(/-/g, "_").toUpperCase();
    // Animate the icon
    skycons.play();
    // Change the icon
    return skycons.set(iconID, Skycons[currentIcon]);
  }
});
