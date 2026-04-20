import { createContext, useContext, useState, useEffect } from "react";

type ApiResponse = {
  message: {
    temperatureF: number;
    temperatureC: number;
    humidity: number;
  };

  apiWeather: {
    current: {
      time: string;
      temperature_2m: number;
      temperature_2m_fahrenheit: number;
      relative_humidity_2m: number;
      apparent_temperature: number;
      apparent_temperature_fahrenheit: number;
      is_day: number;
      is_day_yesorno: string;
      weather_code: number;
      weather_name: string;
      cloud_cover: number;
      precipitation: number;
      rain: number;
      showers: number;
      snowfall: number;
      wind_speed_10m: number;
      wind_direction_10m: number;
      wind_direction_10m_compass: string;
    };

    daily: {
      temperature_2m_max: number[];
      temperature_2m_max_fahrenheit: number;
      temperature_2m_min: number[];
      temperature_2m_min_fahrenheit: number;
      precipitation_probability_max: number[];
    };
  };

  time: string;
  insideSummary: string;
  outsideSummary: string;
};

const ApiContext = createContext<ApiResponse | null>(null);

export function ApiProvider({ children }: { children: React.ReactNode }) {
  const [data, setData] = useState<ApiResponse | null>(null);

  useEffect(() => {
    fetch("/api/weather")
      .then((res) => res.json())
      .then(setData);
  }, []);

  return <ApiContext.Provider value={data}>{children}</ApiContext.Provider>;
}

// This is what components use
export function useApi() {
  return useContext(ApiContext);
}
