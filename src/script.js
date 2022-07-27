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
  icon.setAttribute("src", `http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
}

function getCurrentPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;
  let units = "metric";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather";
  let apiKey = "da16704800751c14adceb19bcac00e36";
  let apiUrl = `${apiEndpoint}?lat=${latitude}&lon=${longitude}&units=${units}&appid=${apiKey}`;
  axios.get(apiUrl).then(showCurrentWeather);
}

function getOnPosition() {
  navigator.geolocation.getCurrentPosition(getCurrentPosition);
}
let locationButton = document.querySelector("#my-loc");
locationButton.addEventListener("click", getOnPosition);

function displayWeather(response) {
  celsiusTemperature = response.data.main.temp;
  document.querySelector("#temperature").innerHTML = Math.round(celsiusTemperature);
  document.querySelector("#humidity").innerHTML = `Humidity: ${response.data.main.humidity}%`;
  document.querySelector("#windSpeed").innerHTML = `Wind: ${response.data.wind.speed} km/h`;
  document.querySelector("#description").innerHTML =response.data.weather[0].description;
  document.querySelector("#city").innerHTML = response.data.name;
  document.querySelector("#icon").setAttribute("src",`http://openweathermap.org/img/wn/${response.data.weather[0].icon}@2x.png`)
}
function searchCity(city) {
  let apiKey = "da16704800751c14adceb19bcac00e36";
  let url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;
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
