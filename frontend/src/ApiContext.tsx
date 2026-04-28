// Import React hooks and utilities for context and state management
import { createContext, useContext, useState, useEffect } from "react";

/**Define the shape of the API response data */
type ApiResponse = {
  // UDP message from Raspberry Pi
  message: {
    temperatureF: number;
    temperatureC: number;
    humidity: number;
  };

  // Response from OpenMeteo API
  apiWeather: {
    // Current weather
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

    // Daily weather
    daily: {
      temperature_2m_max: number[];
      temperature_2m_max_fahrenheit: number;
      temperature_2m_min: number[];
      temperature_2m_min_fahrenheit: number;
      precipitation_probability_max: number[];
    };

    latitude: string;
    longitude: string;
  };

  // Extra information
  time: string;
  insideSummary: string;
  outsideSummary: string;
};

/** Extends the context type */
type ApiContextType = {
  data: ApiResponse | null;
  sendUserInput: (latitude: string, longitude: string) => Promise<void>;
};

/** Create the context with a default value of null */
const ApiContext = createContext<ApiContextType | null>(null);

/** Provider component that wraps the app and provides API data */
export function ApiProvider({ children }: { children: React.ReactNode }) {
  // State to store API response data
  const [data, setData] = useState<ApiResponse | null>(null);

  // Runs once when the component mounts
  useEffect(() => {
    // Fetch default weather data from API
    fetch("/api/weather")
      .then((res) => res.json()) // Convert response to JSON
      .then(setData); // Store result in state
  }, []);

  // Function to send user-provided latitude and longitude to the API
  const sendUserInput = async (latitude: string, longitude: string) => {
    // Send POST request with user coordinates
    const res = await fetch("/api/weather", {
      method: "POST", // HTTP method
      headers: {
        "Content-Type": "application/json", // Specify JSON body
      },
      body: JSON.stringify({ latitude, longitude }), // Convert data to JSON string
    });

    // Parse response JSON
    const result = await res.json();

    // Update state with new data
    setData(result);
  };

  // Provide context values to all child components
  return (
    <ApiContext.Provider value={{ data, sendUserInput }}>
      {children}
    </ApiContext.Provider>
  );
}

// Custom hook for consuming the ApiContext
export function useApi() {
  const context = useContext(ApiContext); // Access context value

  // Throw error if used outside of provider
  if (!context) throw new Error("useApi must be used inside ApiProvider");

  return context; // Return context data and functions
}
