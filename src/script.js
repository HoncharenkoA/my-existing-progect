const API_KEY = "da16704800751c14adceb19bcac00e36";
const CITY_NAME_NODE = document.querySelector("#current-city");

const cities = document.querySelectorAll(".js-city");

cities.forEach(function (cityNode) {
  const cityName = cityNode.getAttribute("data-city-name");
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${API_KEY}&units=metric`;

  axios.get(apiUrl).then(function (response) {
    secondaryCitiesWeather(response, cityNode.parentElement);
  });

  cityNode.addEventListener("click", function () {
    CITY_NAME_NODE.innerHTML = cityName;
    axios.get(apiUrl).then(displayWeather);
  });
});

function secondaryCitiesWeather(response, cityNode) {
  cityNode.querySelector(".js-description").innerHTML =
    response.data.weather[0].description;
  cityNode
    .querySelector(".js-icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  cityNode.querySelector(".js-temperature").innerHTML = `${Math.round(
    response.data.main.temp
  )}˚C`;
}

function formatDate(Date) {
  let now = new Date();
  let liDay = document.querySelector("li#current-day");
  let liTime = document.querySelector("li#current-time");
  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];
  let day = days[now.getDay()];
  let hour = now.getHours();
  if (hour < 10) {
    hour = `0${hour}`;
  }
  let minutes = now.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }
  liTime.innerHTML = `${hour}:${minutes}`;
  liDay.innerHTML = `${day}`;
}
formatDate(Date);

function getForecast(coordinates) {
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${API_KEY}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");
  let forecastHTML = `<div class="row">`;
  forecast.forEach(function (forecastDay, index) {
    if (index > 0 && index < 7) {
      forecastHTML =
        forecastHTML +
        ` <div class="col-2">
  <div class="weather-forecast-date">${formatDay(forecastDay.dt)}</div>
  <img
    src="http://openweathermap.org/img/wn/${forecastDay.weather[0].icon}@2x.png"
    alt=""
    width="42"
  />
  <div class="weather-forecast-temperatures">
    <span class="weather-forecast-temperature-max"> ${Math.round(
      forecastDay.temp.max
    )}° </span>
    <span class="weather-forecast-temperature-min"> ${Math.round(
      forecastDay.temp.min
    )}° </span>
  </div>
</div>
`;
    }
  });
  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function changeCity(event) {
  event.preventDefault();
  let searchInput = document.querySelector("#searchInput");
  let h1 = document.querySelector("h1");
  h1.innerHTML = `${searchInput.value}`;
}

let form = document.querySelector("#search-city");
form.addEventListener("submit", changeCity);

function showCurrentWeather(response) {
  let h1 = document.querySelector("h1");
  h1.innerHTML = response.data.name;
  let span = document.querySelector("#temperature");
  celsiusTemperature = response.data.main.temp;
  let temperature = Math.round(celsiusTemperature);
  span.innerHTML = `${temperature}`;
  let description = document.querySelector("#description");
  description.innerHTML = response.data.weather[0].description;
  let windSpeed = document.querySelector("#windSpeed");
  windSpeed.innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  let humidity = document.querySelector("#humidity");
  humidity.innerHTML = `Humidity: ${response.data.main.humidity}%`;
  let icon = document.querySelector("#icon");
  icon.setAttribute(
    "src",
    `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
  );
  getForecast(response.data.coord);
}

function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&units=${units}&appid=${API_KEY}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

function getOnPosition() {
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}
let locationButton = document.querySelector("#my-loc");
locationButton.addEventListener("click", getOnPosition);

function displayWeather(response) {
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML =
    Math.round(celsiusTemperature);
  document.querySelector(
    "#humidity"
  ).innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector(
    "#windSpeed"
  ).innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  document.querySelector("#description").innerHTML =
    response.data.weather[0].description;
  CITY_NAME_NODE.innerHTML = response.data.name;
  document
    .querySelector("#icon")
    .setAttribute(
      "src",
      `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`
    );
  getForecast(response.data.coord);
}
function searchCity(city) {
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`;
  axios.get(url).then(displayWeather);
}
function findCityWeather(event) {
  event.preventDefault();
  let city = document.querySelector("#searchInput").value;
  searchCity(city);
}
function changeFah() {
  let fahrenheit = Math.round((celsiusTemperature * 9) / 5 + 32);
  let showFahrenheit = document.querySelector("#temperature");
  showFahrenheit.innerHTML = `${fahrenheit}`;
  unitsCel.classList.remove("active");
  unitsFah.classList.add("active");
}
function changeCel() {
  let celsium = Math.round(celsiusTemperature);
  let showCelsium = document.querySelector("#temperature");
  showCelsium.innerHTML = `${celsium}`;
  unitsCel.classList.add("active");
  unitsFah.classList.remove("active");
}

let celsiusTemperature = null;

let unitsFah = document.querySelector("#fahrenheit-link");
unitsFah.addEventListener("click", changeFah);

let unitsCel = document.querySelector("#celsium-link");
unitsCel.addEventListener("click", changeCel);

searchCity("Kyiv");

let formInput = document.querySelector("#search-city");
formInput.addEventListener("submit", findCityWeather);
