const timeEl = document.getElementById('time')
const dateEl = document.getElementById('date')
const currentWeatherItemsEl = document.getElementById('current-weather-items')
const timezone = document.getElementById('time-zone')
const countryEl = document.getElementById('country')
const weatherForecastEl = document.getElementById('weather-forecast')
const currentTempEl = document.getElementById('current-temp')
let latitude = '32.2041'
let longitude = '118.7032'
const days = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
]
const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]

const API_KEY = '49cc8c821cd2aff9af04c9f98c36eb74'

setInterval(() => {
  const time = new Date()
  const month = time.getMonth()
  const date = time.getDate()
  const day = time.getDay()
  const hour = time.getHours()
  const hoursIn12HrFormat = hour >= 13 ? hour % 12 : hour
  const minutes = time.getMinutes()
  const ampm = hour >= 12 ? 'PM' : 'AM'

  timeEl.innerHTML =
    (hoursIn12HrFormat < 10 ? '0' + hoursIn12HrFormat : hoursIn12HrFormat) +
    ':' +
    (minutes < 10 ? '0' + minutes : minutes) +
    ' ' +
    `<span id="am-pm">${ampm}</span>`

  dateEl.innerHTML = days[day] + ', ' + date + ' ' + months[month]
}, 1000)

let weather = {
  // 获取城市经纬度
  fetchLocation: function (city) {
    fetch(
      'http://api.openweathermap.org/geo/1.0/direct?q=' +
        city +
        '&limit=1&appid=' +
        API_KEY,
    )
      .then((Response) => Response.json())
      .then((data) => this.displayWeather(data))
  },

  // 获取天气数据
  displayWeather: function (data) {
    if (Array.isArray(data) && data.length > 0) {
      latitude = data[0].lat
      longitude = data[0].lon
      console.log(latitude, longitude)
      fetch(
        `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`,
      )
        .then((res) => res.json())
        .then((data) => {
          console.log(data)
          showWeatherData(data)
        })
    } else {
      console.error('Invalid data:', data)
      $('#errorModal').modal('show')
      document.querySelector('.searchbar').value = ''
    }
  },

  // 搜索城市
  search: function () {
    this.fetchLocation(document.querySelector('.searchbar').value)
  },
}
getWeatherData()
function getWeatherData() {
  //   navigator.geolocation.getCurrentPosition((success) => {
  //     let { latitude, longitude } = success.coords

  //     fetch(
  //       `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`,
  //     )
  //       .then((res) => res.json())
  //       .then((data) => {
  //         console.log(data)
  //         showWeatherData(data)
  //       })
  //   })

  // 全局操作，点击搜索按钮时触发
  document
    .querySelector('.search button')
    .addEventListener('click', function () {
      weather.search()
      $('#exampleModal').modal('hide')
    })
  fetch(
    `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=hourly,minutely&units=metric&appid=${API_KEY}`,
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data)
      showWeatherData(data)
    })
}

// 显示天气数据
function showWeatherData(data) {
  let { humidity, pressure, sunrise, sunset, wind_speed } = data.current
  console.log(humidity, pressure, sunrise, sunset, wind_speed)

  if (document.querySelector('.searchbar').value == '') {
    timezone.innerHTML = 'NanJing'
  } else {
    timezone.innerHTML = document.querySelector('.searchbar').value
    document.querySelector('.searchbar').value = ''
  }
  countryEl.innerHTML = data.lat + 'N ' + data.lon + 'E'

  currentWeatherItemsEl.innerHTML = `<div class="weather-item">
    <div>Humidity</div>
    <div>${humidity}%</div>
    </div>
    <div class="weather-item">
    <div>Pressure</div>
    <div>${pressure}</div>
    </div>
    <div class="weather-item">
        <div>Wind Speed</div>
        <div>${wind_speed}</div>
        </div>
        
        <div class="weather-item">
        <div>Sunrise</div>
        <div>${window.moment(sunrise * 1000).format('HH:mm a')}</div>
        </div>
        <div class="weather-item">
        <div>Sunset</div>
        <div>${window.moment(sunset * 1000).format('HH:mm a')}</div>
        </div>
        
        
        `
  // 今日天气
  let otherDayForcast = ''
  data.daily.forEach((day, idx) => {
    if (idx == 0) {
      currentTempEl.innerHTML = `
                <img src="http://openweathermap.org/img/wn//${
                  day.weather[0].icon
                }@4x.png" alt="weather icon" class="w-icon">
                <div class="other">
                <div class="day">${window
                  .moment(day.dt * 1000)
                  .format('dddd')}</div>
                    <div class="temp">Night - ${day.temp.night}&#176;C</div>
                    <div class="temp">Day - ${day.temp.day}&#176;C</div>
                    </div>
                    
                    `
    } else {
      otherDayForcast += `
                    <div class="weather-forecast-item">
                    <div class="day">${window
                      .moment(day.dt * 1000)
                      .format('ddd')}</div>
                <img src="http://openweathermap.org/img/wn/${
                  day.weather[0].icon
                }@2x.png" alt="weather icon" class="w-icon">
                <div class="temp">Night - ${day.temp.night}&#176;C</div>
                <div class="temp">Day - ${day.temp.day}&#176;C</div>
                </div>
                
                `
    }
  })

  weatherForecastEl.innerHTML = otherDayForcast
}
// 模态框相关代码
$('.searchbar').keypress(function (e) {
  if (e.key === 'Enter') {
    weather.search()
    $('#exampleModal').modal('hide')
  }
})
