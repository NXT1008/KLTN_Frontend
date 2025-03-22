import { useState, useEffect } from 'react'
import axios from 'axios'
import styled from 'styled-components'

const ForecastCard = () => {
  const [weather, setWeather] = useState(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('Loading...')

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        await fetchCity(latitude, longitude)
        fetchWeather(latitude, longitude)
      },
      (error) => {
        console.error('Error getting location:', error)
        setCity('Unknown')
        setLoading(false)
      }
    )
  }, [])

  const fetchCity = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`
      )
      if (res.data && res.data.address) {
        setCity(res.data.address.city || res.data.address.town || res.data.address.village || 'Unknown')
      } else {
        setCity('Unknown')
      }
    } catch (error) {
      console.error('Error fetching city:', error)
      setCity('Unknown')
    }
  }

  const fetchWeather = async (lat, lon) => {
    try {
      const res = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&daily=temperature_2m_max,temperature_2m_min&timezone=auto`
      )

      const data = res.data
      setWeather({
        temperature: data.current_weather.temperature,
        maxTemp: data.daily.temperature_2m_max[0],
        minTemp: data.daily.temperature_2m_min[0],
        weatherCode: data.current_weather.weathercode
      })

      setLoading(false)
    } catch (error) {
      console.error('Error fetching weather data:', error)
      setLoading(false)
    }
  }

  const getWeatherIcon = (code) => {
    if (code === 0) return '☀️' // Clear sky
    if (code < 3) return '🌤️' // Partly cloudy
    if (code < 45) return '☁️' // Cloudy
    if (code < 60) return '🌧️' // Rain
    return '⛈️' // Thunderstorm
  }

  const getBackgroundColor = (temp) => {
    if (temp >= 30) return '#FF5733' // Hot → Red
    if (temp >= 20) return '#FFA500' // Warm → Orange
    if (temp >= 10) return '#1E90FF' // Cool → Blue
    return '#4682B4' // Cold → Dark Blue
  }

  return (
    <StyledCard bgColor={weather ? getBackgroundColor(weather.temperature) : '#ccc'}>
      {loading ? (
        <p>Loading...</p>
      ) : weather ? (
        <>
          <h3>{city}</h3>
          <p className="icon">{getWeatherIcon(weather.weatherCode)}</p>
          <p className="temp">{weather.temperature}°C</p>
        </>
      ) : (
        <p>Failed to load data</p>
      )}
    </StyledCard>
  )
}

const StyledCard = styled.div`
  width: 200px;
  max-height: 40px;
  padding: 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-radius: 10px;
  background-color: ${(props) => props.bgColor};
  color: white;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2);
  transition: background-color 0.5s ease-in-out;

  h3 {
    font-size: 12px;
    margin: 0;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .icon {
    font-size: 20px;
  }

  .temp {
    font-size: 14px;
    font-weight: bold;
    justify-content: center;
    align-items: center;
    margin: 0;
  }
`

export default ForecastCard
