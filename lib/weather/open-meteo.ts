export interface WeatherData {
  temperature: number // Celsius
  temperatureF: number // Fahrenheit
  feelsLike: number // Celsius
  humidity: number // %
  windSpeed: number // km/h
  windSpeedMph: number
  windDirection: number // degrees
  windDirectionLabel: string
  pressure: number // hPa
  weatherCode: number
  description: string
  emoji: string
  sunrise: string
  sunset: string
  tempMax: number // C
  tempMin: number // C
  estimatedWaterTempF: number
  pressureTrend: 'rising' | 'falling' | 'stable'
}

export interface PressureReading {
  time: string
  pressure: number
}

// WMO Weather Codes
function getWeatherInfo(code: number): { description: string; emoji: string } {
  if (code === 0) return { description: 'Clear sky', emoji: '\u2600\uFE0F' }
  if (code <= 2) return { description: 'Partly cloudy', emoji: '\u26C5' }
  if (code === 3) return { description: 'Overcast', emoji: '\u2601\uFE0F' }
  if (code <= 49) return { description: 'Foggy', emoji: '\u{1F32B}\uFE0F' }
  if (code <= 55) return { description: 'Drizzle', emoji: '\u{1F326}\uFE0F' }
  if (code <= 57) return { description: 'Freezing drizzle', emoji: '\u{1F326}\uFE0F' }
  if (code <= 65) return { description: 'Rain', emoji: '\u{1F327}\uFE0F' }
  if (code <= 67) return { description: 'Freezing rain', emoji: '\u{1F327}\uFE0F' }
  if (code <= 75) return { description: 'Snow', emoji: '\u2744\uFE0F' }
  if (code <= 82) return { description: 'Rain showers', emoji: '\u{1F326}\uFE0F' }
  if (code <= 86) return { description: 'Snow showers', emoji: '\u{1F328}\uFE0F' }
  if (code <= 99) return { description: 'Thunderstorm', emoji: '\u26C8\uFE0F' }
  return { description: 'Unknown', emoji: '\u{1F321}\uFE0F' }
}

function getWindDirection(degrees: number): string {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW']
  return dirs[Math.round(degrees / 22.5) % 16]
}

function estimateWaterTemp(airTempF: number, month: number): number {
  // Rough estimation based on air temp and season lag
  // Water temp typically lags air temp by ~2-4 weeks and is dampened
  const seasonalOffset = [
    -8, -7, -5, -2, 2, 5, 7, 8, 6, 2, -2, -6
  ][month] || 0
  return Math.round(airTempF + seasonalOffset - 5)
}

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
  const url = new URL('https://api.open-meteo.com/v1/forecast')
  url.searchParams.set('latitude', lat.toFixed(4))
  url.searchParams.set('longitude', lon.toFixed(4))
  url.searchParams.set(
    'current',
    'temperature_2m,apparent_temperature,relative_humidity_2m,wind_speed_10m,wind_direction_10m,weather_code,surface_pressure'
  )
  url.searchParams.set(
    'daily',
    'sunrise,sunset,temperature_2m_max,temperature_2m_min'
  )
  url.searchParams.set('hourly', 'surface_pressure')
  url.searchParams.set('timezone', 'auto')
  url.searchParams.set('forecast_days', '1')
  url.searchParams.set('wind_speed_unit', 'mph')

  const res = await fetch(url.toString(), { next: { revalidate: 900 } })
  if (!res.ok) throw new Error(`Weather API error: ${res.status}`)
  const data = await res.json()

  const current = data.current
  const daily = data.daily
  const hourly = data.hourly

  const tempC = current.temperature_2m
  const tempF = Math.round(tempC * 9 / 5 + 32)
  const feelsLikeC = current.apparent_temperature
  const windMph = current.wind_speed_10m
  const windKph = Math.round(windMph * 1.60934)
  const pressure = current.surface_pressure
  const weatherCode = current.weather_code
  const { description, emoji } = getWeatherInfo(weatherCode)

  // Determine pressure trend from hourly data (last 3 hours vs current)
  let pressureTrend: 'rising' | 'falling' | 'stable' = 'stable'
  if (hourly?.surface_pressure && hourly.surface_pressure.length >= 4) {
    const currentHour = new Date().getHours()
    const recentPressures = hourly.surface_pressure.slice(Math.max(0, currentHour - 3), currentHour + 1)
    if (recentPressures.length >= 2) {
      const first = recentPressures[0]
      const last = recentPressures[recentPressures.length - 1]
      const diff = last - first
      if (diff > 1) pressureTrend = 'rising'
      else if (diff < -1) pressureTrend = 'falling'
    }
  }

  const month = new Date().getMonth()
  const estimatedWaterTempF = estimateWaterTemp(tempF, month)

  const sunrise = daily.sunrise?.[0]
    ? new Date(daily.sunrise[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : 'N/A'
  const sunset = daily.sunset?.[0]
    ? new Date(daily.sunset[0]).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true })
    : 'N/A'

  return {
    temperature: tempC,
    temperatureF: tempF,
    feelsLike: feelsLikeC,
    humidity: current.relative_humidity_2m,
    windSpeed: windKph,
    windSpeedMph: Math.round(windMph),
    windDirection: current.wind_direction_10m,
    windDirectionLabel: getWindDirection(current.wind_direction_10m),
    pressure: Math.round(pressure),
    weatherCode,
    description,
    emoji,
    sunrise,
    sunset,
    tempMax: Math.round(daily.temperature_2m_max?.[0] * 9 / 5 + 32) || tempF,
    tempMin: Math.round(daily.temperature_2m_min?.[0] * 9 / 5 + 32) || tempF,
    estimatedWaterTempF,
    pressureTrend,
  }
}

export function getFishingQualityScore(weather: WeatherData, solunarRating: number): number {
  let score = 5 // baseline

  // Pressure trend: rising = good, stable = neutral, falling = bad
  if (weather.pressureTrend === 'rising') score += 1
  else if (weather.pressureTrend === 'falling') score -= 1

  // Weather conditions: clear/partly cloudy good, heavy rain/storm bad
  if (weather.weatherCode === 0 || weather.weatherCode <= 2) score += 1
  else if (weather.weatherCode >= 80) score -= 1
  else if (weather.weatherCode >= 95) score -= 2

  // Time of day: dawn and dusk are prime
  const hour = new Date().getHours()
  if (hour >= 5 && hour <= 8) score += 2 // dawn
  else if (hour >= 17 && hour <= 20) score += 2 // dusk
  else if (hour >= 9 && hour <= 16) score += 0 // midday

  // Season
  const month = new Date().getMonth()
  if (month >= 2 && month <= 4) score += 1 // spring
  else if (month >= 8 && month <= 10) score += 1 // fall

  // Solunar blend
  score = Math.round((score + solunarRating) / 2)

  return Math.min(10, Math.max(1, score))
}
