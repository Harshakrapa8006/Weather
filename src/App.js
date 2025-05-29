import React, { useState } from "react";
import axios from "axios";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

// Register Chart.js components
ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

// ✅ Use your own API key from OpenWeatherMap
const API_KEY = "a0f930566647008036d42a5099cd2884";

function App() {
  const [city, setCity] = useState("");
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecastData, setForecastData] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!city.trim()) {
      alert("Please enter a city name!");
      return;
    }

    setLoading(true);
    setCurrentWeather(null);
    setForecastData([]);

    try {
      // 1. Get coordinates from city name
      const geoRes = await axios.get(
        `https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${API_KEY}`
      );

      if (geoRes.data.length === 0) {
        alert("City not found!");
        setLoading(false);
        return;
      }

      const { lat, lon } = geoRes.data[0];

      // 2. Get current weather
      const weatherRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );
      setCurrentWeather(weatherRes.data);

      // 3. Get 5-day forecast (every 3 hours)
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
      );

      // 4. Filter daily forecasts at 12:00 PM only
      const dailyForecasts = forecastRes.data.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .slice(0, 5);

      const tempData = dailyForecasts.map((entry) => ({
        date: new Date(entry.dt * 1000).toLocaleDateString(),
        temp: entry.main.temp,
      }));

      setForecastData(tempData);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Error fetching data. Please check your API key and city name.");
    }

    setLoading(false);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const getWeatherIcon = (weatherCode) => {
    const iconMap = {
      '01d': '☀️', '01n': '🌙',
      '02d': '⛅', '02n': '☁️',
      '03d': '☁️', '03n': '☁️',
      '04d': '☁️', '04n': '☁️',
      '09d': '🌧️', '09n': '🌧️',
      '10d': '🌦️', '10n': '🌧️',
      '11d': '⛈️', '11n': '⛈️',
      '13d': '❄️', '13n': '❄️',
      '50d': '🌫️', '50n': '🌫️'
    };
    return iconMap[weatherCode] || '🌤️';
  };

  const styles = {
    container: {
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif"
    },
    header: {
      textAlign: 'center',
      color: 'white',
      marginBottom: '40px',
      textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
    },
    title: {
      fontSize: '3rem',
      fontWeight: '300',
      margin: '0',
      letterSpacing: '2px'
    },
    subtitle: {
      fontSize: '1.2rem',
      opacity: '0.9',
      marginTop: '10px'
    },
    searchContainer: {
      display: 'flex',
      justifyContent: 'center',
      marginBottom: '40px',
      gap: '15px'
    },
    searchInput: {
      padding: '15px 20px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '50px',
      width: '300px',
      boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
      outline: 'none',
      transition: 'all 0.3s ease'
    },
    searchButton: {
      padding: '15px 30px',
      fontSize: '16px',
      border: 'none',
      borderRadius: '50px',
      background: 'linear-gradient(45deg, #ff6b6b, #ee5a52)',
      color: 'white',
      cursor: 'pointer',
      boxShadow: '0 4px 15px rgba(0,0,0,0.2)',
      transition: 'all 0.3s ease',
      fontWeight: '600'
    },
    loadingSpinner: {
      textAlign: 'center',
      color: 'white',
      fontSize: '18px',
      padding: '20px'
    },
    weatherCard: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      margin: '0 auto 40px',
      maxWidth: '400px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    cityName: {
      fontSize: '2rem',
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: '20px'
    },
    currentTemp: {
      fontSize: '4rem',
      fontWeight: '300',
      color: '#667eea',
      textAlign: 'center',
      margin: '20px 0'
    },
    weatherIcon: {
      fontSize: '3rem',
      textAlign: 'center',
      marginBottom: '15px'
    },
    weatherDesc: {
      fontSize: '1.2rem',
      color: '#666',
      textAlign: 'center',
      textTransform: 'capitalize',
      marginBottom: '20px'
    },
    weatherDetails: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '15px',
      marginTop: '20px'
    },
    detailItem: {
      textAlign: 'center',
      padding: '15px',
      background: 'rgba(102, 126, 234, 0.1)',
      borderRadius: '10px'
    },
    detailLabel: {
      fontSize: '0.9rem',
      color: '#666',
      marginBottom: '5px'
    },
    detailValue: {
      fontSize: '1.1rem',
      fontWeight: '600',
      color: '#333'
    },
    chartContainer: {
      background: 'rgba(255, 255, 255, 0.95)',
      borderRadius: '20px',
      padding: '30px',
      margin: '0 auto',
      maxWidth: '800px',
      boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255,255,255,0.2)'
    },
    chartTitle: {
      fontSize: '1.8rem',
      fontWeight: '600',
      color: '#333',
      textAlign: 'center',
      marginBottom: '30px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>Weather Dashboard</h1>
        <p style={styles.subtitle}>Get current weather and 5-day forecast for any city</p>
      </div>

      <div style={styles.searchContainer}>
        <input
          type="text"
          placeholder="Enter city name..."
          value={city}
          onChange={(e) => setCity(e.target.value)}
          onKeyPress={handleKeyPress}
          style={styles.searchInput}
        />
        <button 
          onClick={handleSearch} 
          style={styles.searchButton}
          onMouseOver={(e) => e.target.style.transform = 'translateY(-2px)'}
          onMouseOut={(e) => e.target.style.transform = 'translateY(0)'}
        >
          Search
        </button>
      </div>

      {loading && (
        <div style={styles.loadingSpinner}>
          <div>🌤️ Loading weather data...</div>
        </div>
      )}

      {currentWeather && (
        <div style={styles.weatherCard}>
          <h2 style={styles.cityName}>{currentWeather.name}</h2>
          
          <div style={styles.weatherIcon}>
            {getWeatherIcon(currentWeather.weather[0].icon)}
          </div>
          
          <div style={styles.currentTemp}>
            {Math.round(currentWeather.main.temp)}°C
          </div>
          
          <div style={styles.weatherDesc}>
            {currentWeather.weather[0].description}
          </div>

          <div style={styles.weatherDetails}>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Feels like</div>
              <div style={styles.detailValue}>{Math.round(currentWeather.main.feels_like)}°C</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Humidity</div>
              <div style={styles.detailValue}>{currentWeather.main.humidity}%</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Wind Speed</div>
              <div style={styles.detailValue}>{currentWeather.wind.speed} m/s</div>
            </div>
            <div style={styles.detailItem}>
              <div style={styles.detailLabel}>Pressure</div>
              <div style={styles.detailValue}>{currentWeather.main.pressure} hPa</div>
            </div>
          </div>
        </div>
      )}

      {forecastData.length > 0 && (
        <div style={styles.chartContainer}>
          <h2 style={styles.chartTitle}>5-Day Temperature Forecast</h2>
          <Line
            data={{
              labels: forecastData.map((item) => item.date),
              datasets: [
                {
                  label: "Temperature (°C)",
                  data: forecastData.map((item) => item.temp),
                  fill: true,
                  backgroundColor: 'rgba(102, 126, 234, 0.1)',
                  borderColor: '#667eea',
                  borderWidth: 3,
                  pointBackgroundColor: '#667eea',
                  pointBorderColor: '#fff',
                  pointBorderWidth: 2,
                  pointRadius: 6,
                  pointHoverRadius: 8,
                  tension: 0.4,
                },
              ],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  position: "top",
                  labels: {
                    font: {
                      size: 14,
                      weight: '600'
                    },
                    color: '#333'
                  }
                },
                tooltip: {
                  backgroundColor: 'rgba(0,0,0,0.8)',
                  titleColor: 'white',
                  bodyColor: 'white',
                  borderColor: '#667eea',
                  borderWidth: 1
                }
              },
              scales: {
                y: {
                  beginAtZero: false,
                  grid: {
                    color: 'rgba(0,0,0,0.1)'
                  },
                  ticks: {
                    color: '#666',
                    font: {
                      weight: '500'
                    }
                  }
                },
                x: {
                  grid: {
                    color: 'rgba(0,0,0,0.1)'
                  },
                  ticks: {
                    color: '#666',
                    font: {
                      weight: '500'
                    }
                  }
                }
              }
            }}
          />
        </div>
      )}
    </div>
  );
}

export default App;
