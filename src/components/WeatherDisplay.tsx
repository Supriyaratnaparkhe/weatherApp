import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import "../App.css";
import humidity from "./humidity.png";
import wind from "./wind.jpg";

interface WeatherData {
  name: string;
  weather: { icon: string; description: string }[];
  main: { temp: number; humidity: number; pressure: number };
  coord: { lat: number; lon: number };
  visibility: number;
  wind: { speed: number };
  dateString: string;
}
declare global {
  interface Window {
    google: any;
  }
}
const WeatherDisplay: React.FC = () => {
  const { cityname, country } = useParams<{
    cityname: string;
    country: string;
  }>();
  const apiKey = "e635fcaffbb0135e1a96030f7178b1a0";
  const [data, setData] = useState<WeatherData | null>(null); 
  const [forecastData, setForecastData] = useState<any[] | null>(null); 
  const navigate=useNavigate();

  useEffect(() => {
    const getWeatherDetails = () => {
      if (!cityname) return;
      const apiURL = `https://api.openweathermap.org/data/2.5/weather?q=${cityname}&appid=${apiKey}`;
      axios
        .get<WeatherData>(apiURL) 
        .then((res) => {
          setData(res.data);
          console.log(res.data);
        })
        .catch((err) => {
          console.log("Error fetching weather data:", err);
          setData(null);
        });
    };
    getWeatherDetails();
  }, [cityname]);

  useEffect(() => {
    const getForecastData = () => {
      if (!cityname) return;
      const apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${cityname}&appid=${apiKey}`;
      axios
        .get(apiURL)
        .then((res) => {
          const filteredForecastData = res.data.list.filter((forecast: any) => {
            const forecastTime = new Date(forecast.dt_txt).getUTCHours();
            return forecastTime === 6;
          });
          setForecastData(filteredForecastData);
        })
        .catch((err) => {
          console.log("Error fetching forecast data:", err);
          setForecastData(null);
        });
    };
    getForecastData();
  }, [cityname]);

  useEffect(() => {
    if (data) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: { lat: data.coord.lat, lng: data.coord.lon },
        zoom: 10, 
      });

      new window.google.maps.Marker({
        position: { lat: data.coord.lat, lng: data.coord.lon }, 
        map,
        title: `${cityname}, ${country}`, 
      });
    }
  }, [data, cityname, country]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };
  const handleBack=()=>{
    navigate('/');
  }
  return (
    <div className="body-container">
      <div className="container1">
        <div className="current">
          <div>
            <div className="back"><button onClick={handleBack}>Back</button></div>
            {data && (
              <div>
                <div className="cityname">{data.name}</div>
                <div className="country">{country}</div>
                <div style={{display:"flex",alignItems:"center"}}>
                  <div><img
                  src={`http://openweathermap.org/img/wn/${data.weather[0].icon}.png`}
                  alt="Weather Icon"
                /></div>
                <div className="datainfo">{data.weather[0].description}</div>
                </div>
                
                <div className="temperature">{(data.main.temp - 273.15).toFixed(2)}°C</div>
                <div className="datainfo">Humidity : {data.main.humidity}%</div>
                <div className="datainfo">Wind speed : {data.wind.speed} m/s</div>
                <div className="datainfo">Pressure : {data.main.pressure} hPa</div>
                <div className="datainfo">Visibility : {data.visibility / 1000} Km</div>
              </div>
            )}
          </div>
        </div>
        <div className="right">
        <div id="map" style={{ width: "100%", height: "50%" }}></div>
          {forecastData && (
            <div style={{ width: "100%" }}>
              <div className="heading">5-Days Forecast</div>
              <div className="card-container">
                {forecastData.map((forecast: any, index: number) => (
                  <div key={index} className="card">
                    <div>{formatDate(forecast.dt_txt)}</div>
                    <div style={{ display: "flex", alignItems: "center" }}>
                      <div>
                        <img
                          src={`http://openweathermap.org/img/wn/${forecast.weather[0].icon}.png`}
                          alt="Weather Icon"
                        />
                      </div>
                      <div>{forecast.weather[0].description}</div>
                    </div>
                    <div className="temperature">
                      {(forecast.main.temp - 273.15).toFixed(2)}°C
                    </div>
                    <div style={{ display: "flex", gap: "20px",marginTop:"10px" }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <img
                          src={humidity}
                          style={{
                            width: "15px",
                            height: "15px",
                            borderRadius: "100%",
                          }}
                          alt="humidity"
                        />
                        {forecast.main.humidity} %
                      </div>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: "5px",
                        }}
                      >
                        <img
                          src={wind}
                          style={{
                            width: "15px",
                            height: "15px",
                            borderRadius: "100%",
                          }}
                          alt="wind"
                        />
                        {forecast.wind.speed} m/s
                      </div>
                    </div>
                    <div style={{marginTop:"10px"}}>
                      {(forecast.main.temp_min - 273.15).toFixed(2)}/
                      {(forecast.main.temp_max - 273.15).toFixed(2)}°C
                    </div>
                    <br />
                  </div>
                ))}
              </div>
            </div>
          )}
          
        </div>
      </div>
    </div>
  );
};

export default WeatherDisplay;
