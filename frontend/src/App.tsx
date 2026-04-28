// Allows for the page to update by changing components instead of loading new page
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Calls the backend API
import { useApi } from "./ApiContext";
import { useState, useEffect } from "react";

// Styling and functionality for Clerk
import "./App.css";
import { Show, SignInButton, UserButton, useUser } from "@clerk/react";
import { MonthlyReportProvider, useMonthlyReport } from "./ReportContext";

/** Formats temperatures; handles undefined/null safely */
const formatTemp = (temp: number | undefined | null) => {
  if (temp === undefined || temp === null) return "--";
  return parseFloat(temp.toFixed(2)).toString();
};

/** Top navigation bar. */
const NavBar = () => {
  return (
    <div className="navbar bg-gradient-to-r from-slate-900 to-[#60298E]">
      <NavBarLeft />
      <NavBarCenter />
      <NavBarRight />
    </div>
  );
};

/** Left navbar is logo. */
const NavBarLeft = () => {
  return (
    <div className="navbar-left">
      {/** Weather icons created by iconixar - Flaticon */}
      <a href="/">
        <img
          src="/favicon.png"
          alt="A picture of the sun partially obscured by a cloud."
          className="w-8 h-8"
        />
      </a>
    </div>
  );
};

/** Specifies that the navbar buttons must take two strings: a name and a link (href). */
interface NavBarButtonProps {
  name: string;
  link: string;
}

/** Component for the buttons on the navbar. */
const NavBarButton = ({ name, link }: NavBarButtonProps) => {
  return (
    <div>
      <a href={link}>
        <button className="navbar-button cursor-pointer w-40 bg-black/20 backdrop-blur-sm p-2 rounded-lg shadow">
          {name}
        </button>
      </a>
    </div>
  );
};

/** Center navbar is links. */
const NavBarCenter = () => {
  return (
    <div className="navbar-center absolute left-1/2 -translate-x-1/2">
      <ul className="nav-links gap-2">
        <li>
          <NavBarButton name="Weather" link="/" />
        </li>

        <li>
          <NavBarButton name="Report" link="/report" />
        </li>

        <li>
          <NavBarButton name="About" link="/about" />
        </li>
      </ul>
    </div>
  );
};

/** Right navbar is login. */
const NavBarRight = () => {
  return (
    <div className="navbar-right flex gap-4">
      {/** Signed out */}
      <Show when="signed-out">
        {/* Use mode="modal" if you want to keep them on your page instead of redirecting */}
        <SignInButton mode="modal">
          <div className="weather-card cursor-pointer bg-black/20 backdrop-blur-sm p-2 w-20 rounded-lg shadow text-center">
            Login
          </div>
        </SignInButton>
      </Show>

      {/** Signed in */}
      <Show when="signed-in">
        <UserButton />
      </Show>
    </div>
  );
};

/** Shows a picture of clouds and the main site title. */
const Banner = () => {
  return (
    <div className="flex items-center justify-center h-40 banner-bg">
      <h1 className="header-text pt-12">Environmental Monitor</h1>
    </div>
  );
};

/** Specifies that the weather card component must take two strings. */
interface WeatherCardProps {
  title?: string;
  content?: string;
}

/** Defines the weather card component which has two props: a title and content. */
const WeatherCard = ({ title, content }: WeatherCardProps) => {
  return (
    <div className="weather-card bg-black/20 backdrop-blur-sm p-4 rounded-lg shadow">
      <p className="text-sm text-white">{title}</p>
      <h2 className="text-2xl font-bold">{content}</h2>
    </div>
  );
};

/** Component for the inside weather summary. */
const InsideWeatherSummary = () => {
  const newWeatherData = useApi();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#60298E] pt-8 px-6">
      <WeatherCard
        title="Inside Summary"
        content={newWeatherData?.data?.insideSummary}
      />
    </div>
  );
};

/** Component for the inside weather dashboard. */
const InsideWeatherDashboard = () => {
  const newWeatherData = useApi();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#60298E] p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <WeatherCard
          title="Temperature"
          content={`${formatTemp(newWeatherData?.data?.message.temperatureF ?? 0)} °F
          (${formatTemp(newWeatherData?.data?.message.temperatureC ?? 0)} °C)`}
        />

        <WeatherCard
          title="Humidity"
          content={`${formatTemp(newWeatherData?.data?.message.humidity ?? 0)}%`}
        />
      </div>
    </div>
  );
};

/** Component for the inside weather summary. */
const OutsideWeatherSummary = () => {
  const newWeatherData = useApi();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#60298E] pt-2 px-6">
      <WeatherCard
        title="Outside Summary"
        content={newWeatherData?.data?.outsideSummary}
      />
    </div>
  );
};

/** Decides which icon to show based on weather code. */
const WeatherIconDecider = () => {
  const newWeatherData = useApi();

  switch (newWeatherData?.data?.apiWeather.current.weather_name) {
    // Clear skies
    case "Clear sky":
    case "Mainly clear":
      return <img src="/sun.png" alt="Clear sky" className="w-8 h-8" />;

    // Parly cloudy
    case "Partly cloudy":
      return (
        <img src="/partly-cloudy.png" alt="Partly cloudy" className="w-8 h-8" />
      );

    // Cloudy, overcast, foggy
    case "Overcast":
    case "Fog":
    case "Depositing rime fog":
      return (
        <img
          src="/cloudy.png"
          alt="Cloudy, overcast, foggy"
          className="w-8 h-8"
        />
      );

    // Drizzle
    case "Light drizzle":
    case "Moderate drizzle":
    case "Dense drizzle":
    case "Light freezing drizzle":
    case "Dense freezing drizzle":
      return <img src="/drizzle.png" alt="Drizzle" className="w-8 h-8" />;

    // Rain
    case "Slight rain":
    case "Moderate rain":
    case "Heavy rain":
    case "Light freezing rain":
    case "Heavy freezing rain":
    case "Slight rain showers":
    case "Moderate rain showers":
    case "Violent rain showers":
      return <img src="/rain.png" alt="Rain" className="w-8 h-8" />;

    // Thunderstorms
    case "Thunderstorm":
    case "Thunderstorm with slight hail":
    case "Thunderstorm with heavy hail":
      return <img src="/storm.png" alt="Thunderstorms" className="w-8 h-8" />;

    // Snow
    case "Slight snow fall":
    case "Moderate snow fall":
    case "Heavy snow fall":
    case "Snow grains":
    case "Slight snow showers":
    case "Heavy snow showers":
      return <img src="/snow.png" alt="Snow" className="w-8 h-8" />;

    default:
      return <p>No match</p>;
  }
};

/** Weather card but only takes one in-line prop: content (string). */
const WeatherCardWithIcon = ({ content }: { content?: string }) => {
  return (
    <div className="weather-card bg-black/20 backdrop-blur-sm p-4 rounded-lg shadow flex items-center justify-center gap-2">
      <h2 className="text-2xl font-bold">{content}</h2>
      <WeatherIconDecider />
    </div>
  );
};

/** Component for the outside weather dashboard. */
const OutsideWeatherDashboard = () => {
  const newWeatherData = useApi();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#60298E] pt-2 pb-6 px-6">
      {/** Defines how the grid is structured for this component */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <WeatherCardWithIcon
          content={newWeatherData?.data?.apiWeather.current.weather_name}
        />

        <WeatherCard
          title="Temperature"
          content={`${formatTemp(newWeatherData?.data?.apiWeather.current.temperature_2m_fahrenheit ?? 0)} °F
          (${formatTemp(newWeatherData?.data?.apiWeather.current.temperature_2m ?? 0)} °C)`}
        />

        <WeatherCard
          title="Feels Like"
          content={`${formatTemp(newWeatherData?.data?.apiWeather.current.apparent_temperature_fahrenheit ?? 0)} °F
            (${formatTemp(newWeatherData?.data?.apiWeather.current.apparent_temperature ?? 0)} °C)`}
        />

        <WeatherCard
          title="Humidity"
          content={`${formatTemp(newWeatherData?.data?.apiWeather.current.relative_humidity_2m ?? 0)}%`}
        />

        <WeatherCard
          title="Daylight"
          content={newWeatherData?.data?.apiWeather.current.is_day_yesorno}
        />

        <WeatherCard
          title="Cloudy"
          content={`${newWeatherData?.data?.apiWeather.current.cloud_cover}%`}
        />

        <WeatherCard
          title="Wind Speed"
          content={`${newWeatherData?.data?.apiWeather.current.wind_speed_10m} miles per hour`}
        />

        {/** Shows where the wind is coming from, not where it's going */}
        <WeatherCard
          title="Wind Direction"
          content={`${newWeatherData?.data?.apiWeather.current.wind_direction_10m_compass}
            (${newWeatherData?.data?.apiWeather.current.wind_direction_10m}°)`}
        />

        {/** Conditional in case there is no precipitation */}
        <WeatherCard
          title="Precipitation"
          content={
            // If precipitation is zero, say none, else show amount
            newWeatherData?.data?.apiWeather.current.precipitation === 0
              ? "None"
              : `{weatherData.outside.precipitation} inches`
          }
        />

        <WeatherCard
          title="Rain"
          content={
            newWeatherData?.data?.apiWeather.current.rain === 0
              ? "None"
              : `{weatherData.outside.rain} inches`
          }
        />

        <WeatherCard
          title="Showers"
          content={
            newWeatherData?.data?.apiWeather.current.showers === 0
              ? "None"
              : `{weatherData.outside.showers} inches`
          }
        />

        <WeatherCard
          title="Snowfall"
          content={
            newWeatherData?.data?.apiWeather.current.snowfall === 0
              ? "None"
              : `{weatherData.outside.snowfall} inches`
          }
        />

        <WeatherCard
          title="Latitude"
          content={newWeatherData?.data?.apiWeather.latitude}
        />

        <WeatherCard
          title="Longitude"
          content={newWeatherData?.data?.apiWeather.longitude}
        />
      </div>
    </div>
  );
};

/** Taken from the OpenStreetMap site to embed on the site. */
const OpenStreetMap = () => {
  return (
    <div className="w-200 pt-12 mx-auto">
      <div>
        <iframe
          width="900"
          height="300"
          src="https://www.openstreetmap.org/export/embed.html?bbox=-82.21352577209474%2C36.58000536706752%2C-82.17327117919923%2C36.605916527931974&amp;layer=mapnik"
          style={{ border: "1px solid black" }}
        />
      </div>
      <div className="pt-4">
        <a
          target="_blank"
          href="https://www.openstreetmap.org/?#map=15/36.59296/-82.19340"
        >
          View Larger Map
        </a>
      </div>
    </div>
  );
};

/** Footer element of the page. */
const BottomBar = () => {
  return (
    <div>
      <div className="w-3/4 mx-auto h-px bg-gray-400 my-6"></div>
      <div className="pb-6">Copyright 2026</div>
    </div>
  );
};

/** Welcome message that change based on if user is logged in */
const WelcomeMessage = () => {
  const { user } = useUser();

  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#60298E] pt-8 px-6">
      {/** Welcome new user and inform them of login */}
      <Show when="signed-out">
        <div className="weather-card bg-black/20 backdrop-blur-sm p-4 rounded-lg shadow">
          <p className="text-sm text-white">
            Welcome to the Environmental Monitor App!
          </p>
          <h2 className="text-2xl font-bold">
            Login or register for a personalized weather forecast.
          </h2>
        </div>
      </Show>

      {/** Welcome user back if they are logged in */}
      <Show when="signed-in">
        <div className="weather-card bg-black/20 backdrop-blur-sm p-4 rounded-lg shadow">
          <p className="text-sm text-white">Welcome back, {user?.firstName}</p>
          <LatitudeLongitudeInputBox />
        </div>
      </Show>
    </div>
  );
};

/** Allows the user to input a latitude and longitude; saves to local storage */
const LatitudeLongitudeInputBox = () => {
  // Get the sendUserInput function from API context
  const { sendUserInput } = useApi();

  // State for latitude, initialized from localStorage if available
  const [latitude, setLatitude] = useState(() => {
    return localStorage.getItem("latitude") || ""; // Fallback to empty string if not found
  });

  // State for longitude, initialized from localStorage if available
  const [longitude, setLongitude] = useState(() => {
    return localStorage.getItem("longitude") || ""; // Fallback to empty string if not found
  });

  // Persist latitude to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("latitude", latitude);
  }, [latitude]);

  // Persist longitude to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("longitude", longitude);
  }, [longitude]);

  // Handle submit button click
  const handleSubmit = () => {
    // Send the current latitude and longitude to the API
    sendUserInput(latitude, longitude);
  };

  return (
    <div>
      <div>
        {/* header */}
        <div className="text-center text-white mb-4">Select a Location</div>

        {/* inputs */}
        <div className="grid grid-cols-2 px-8 gap-8">
          <label>Latitude:</label>
          <label>Longitude:</label>

          <input
            type="text"
            placeholder="Latitude"
            value={latitude}
            onChange={(e) => setLatitude(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="Longitude"
            value={longitude}
            onChange={(e) => setLongitude(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-purple-900 hover:bg-purple-700 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

/** Represents the weather page. */
const Weather = () => {
  return (
    <div>
      <WelcomeMessage />
      <InsideWeatherSummary />
      <InsideWeatherDashboard />
      <OutsideWeatherSummary />
      <OutsideWeatherDashboard />
      <OpenStreetMap />
    </div>
  );
};

/** Title card for the report page. */
const ReportTitle = () => {
  const reportData = useMonthlyReport();

  return (
    <div className="grid grid-cols-1 md:grid-cols-1 gap-6 mt-6">
      <WeatherCard
        title="Monthly Report"
        content={`Showing report for ${reportData?.report?.starting_date}
        to ${reportData?.report?.ending_date} with ${reportData?.report?.sample_count} samples.`}
      />
    </div>
  );
};

/** Shows the dates selected for the data */
const DateRangeDisplay = () => {
  const reportData = useMonthlyReport();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
      <WeatherCard
        title="Start Date"
        content={reportData?.report?.starting_date}
      />
      <WeatherCard title="End Date" content={reportData?.report?.ending_date} />
    </div>
  );
};

/** Dashboard for the inside weather report. */
const ReportInside = () => {
  const reportData = useMonthlyReport();

  return (
    <div>
      <h2 className="pt-6">Inside</h2>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <WeatherCard
          title="Starting Temperature"
          content={`${formatTemp(reportData?.report?.inside?.starting_temperatureF)} °F
          (${formatTemp(reportData?.report?.inside?.starting_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Starting Humidity"
          content={`${formatTemp(reportData?.report?.inside?.starting_humidity)}%`}
        />

        <WeatherCard
          title="Ending Temperature"
          content={`${formatTemp(reportData?.report?.inside?.ending_temperatureF)} °F
          (${formatTemp(reportData?.report?.inside?.ending_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Ending Humidity"
          content={`${formatTemp(reportData?.report?.inside?.ending_humidity)}%`}
        />

        <WeatherCard
          title="Temperature Delta"
          content={`${formatTemp(reportData?.report?.inside?.delta_temperatureF)} °F
          (${formatTemp(reportData?.report?.inside?.delta_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Humidity Delta"
          content={`${formatTemp(reportData?.report?.inside?.delta_humidity)}%`}
        />

        <WeatherCard
          title="Average Temperature"
          content={`${formatTemp(reportData?.report?.inside?.average_temperatureF)} °F
          (${formatTemp(reportData?.report?.inside?.average_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Average Humidity"
          content={`${formatTemp(reportData?.report?.inside?.average_humidity)}%`}
        />
      </div>
    </div>
  );
};

/** Dashboard for the outside weather report. */
const ReportOutside = () => {
  const reportData = useMonthlyReport();

  return (
    <div>
      <h2 className="pt-6">Outside</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-6">
        <WeatherCard
          title="Starting Temperature"
          content={`${formatTemp(reportData?.report?.outside?.starting_temperatureF)} °F
          (${formatTemp(reportData?.report?.outside?.starting_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Starting Humidity"
          content={`${formatTemp(reportData?.report?.outside?.starting_humidity)}%`}
        />

        <WeatherCard
          title="Ending Temperature"
          content={`${formatTemp(reportData?.report?.outside?.ending_temperatureF)} °F
          (${formatTemp(reportData?.report?.outside?.ending_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Ending Humidity"
          content={`${formatTemp(reportData?.report?.outside?.ending_humidity)}%`}
        />

        <WeatherCard
          title="Temperature Delta"
          content={`${formatTemp(reportData?.report?.outside?.delta_temperatureF)} °F
          (${formatTemp(reportData?.report?.outside?.delta_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Humidity Delta"
          content={`${formatTemp(reportData?.report?.outside?.delta_humidity)}%`}
        />

        <WeatherCard
          title="Average Temperature"
          content={`${formatTemp(reportData?.report?.outside?.average_temperatureF)} °F
          (${formatTemp(reportData?.report?.outside?.average_temperatureC)} °C)`}
        />

        <WeatherCard
          title="Average Humidity"
          content={`${formatTemp(reportData?.report?.outside?.average_humidity)}%`}
        />
      </div>
    </div>
  );
};

/** Allows the user to input a start and end date; stored in local storage */
const ReportInputBox = () => {
  // Get the sendUserInput function from API context
  const { generateMonthlyReport } = useMonthlyReport();

  // State for latitude, initialized from localStorage if available
  const [startDate, setStartDate] = useState(() => {
    return localStorage.getItem("report_start_date") || ""; // Fallback to empty string if not found
  });

  // State for longitude, initialized from localStorage if available
  const [endDate, setEndDate] = useState(() => {
    return localStorage.getItem("report_end_date") || ""; // Fallback to empty string if not found
  });

  // Persist latitude to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("report_start_date", startDate);
  }, [startDate]);

  // Persist longitude to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("report_end_date", endDate);
  }, [endDate]);

  // Handle submit button click
  const handleSubmit = () => {
    if (startDate && endDate) {
      // Trigger the POST request through the context
      generateMonthlyReport(startDate, endDate);
    } else {
      alert("Please select both a start and end date.");
    }
  };

  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#60298E] pt-8">
      <div className="weather-card bg-black/20 backdrop-blur-sm p-4 rounded-lg shadow py-6">
        {/* header */}
        <div className="text-center text-white mb-4">Select a Date Range</div>
        <p>Input a date to start creating a report and an ending date.</p>
        <p>
          If no date is provided, it will default to the earliest and latest
          possible dates.
        </p>

        {/* inputs */}
        <div className="grid grid-cols-2 px-8 gap-8">
          <label>Starting Date:</label>
          <label>Ending Date:</label>
          <input
            type="text"
            placeholder="Start Date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border p-2 rounded w-full"
          />

          <input
            type="text"
            placeholder="End Date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border p-2 rounded w-full"
          />
        </div>

        {/* button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={handleSubmit}
            className="bg-purple-900 hover:bg-purple-700 text-white px-6 py-2 rounded"
          >
            Submit
          </button>
        </div>
      </div>
    </div>
  );
};

/** Represents the report page. */
const Report = () => {
  return (
    <MonthlyReportProvider>
      <div className="bg-gradient-to-r from-slate-900 to-[#60298E] pt-2 pb-6 px-6">
        <ReportInputBox />
        <ReportTitle />
        <DateRangeDisplay />
        <ReportInside />
        <ReportOutside />
      </div>
    </MonthlyReportProvider>
  );
};

/** Represents the about page. */
const About = () => {
  return (
    <div className="bg-gradient-to-r from-slate-900 to-[#60298E] min-h-screen px-6 pt-4">
      {/* Title Section */}
      <div className="max-w-5xl mx-auto text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Meet the Developers</h1>
      </div>

      {/* Main Content Section */}
      <div className="max-w-5xl mx-auto">
        <div className="weather-card bg-black/20 backdrop-blur-sm p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Overview</h2>
          <p className="text-gray-300">
            This website was created as a capstone project for Northeast State
            Community College during the Spring semester of 2026.
          </p>
        </div>

        <div className="weather-card bg-black/20 backdrop-blur-sm p-6 rounded-lg shadow mb-8">
          <h2 className="text-2xl font-semibold mb-4">Details</h2>
          <p className="text-gray-300">
            This website is powered by a C# ASP.NET backend alongside a React
            frontend using Vite.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="max-w-5xl mx-auto mt-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pb-10">
          {/* Person 1 */}
          <div className="weather-card bg-black/20 backdrop-blur-sm p-6 rounded-lg shadow text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              {/* Replace with <img src="/your-image.jpg" /> */}
              <span className="text-gray-400">
                <img
                  src="https://avatars.githubusercontent.com/u/159482010?v=4"
                  className="rounded-full object-cover"
                />
              </span>
            </div>
            <h3 className="text-xl font-semibold">Alexander Jones</h3>
            <p className="text-gray-400">Backend Developer</p>
            <p className="text-gray-400">Likes to play video games.</p>

            <a href="https://github.com/alex-jns" target="_blank">
              <button
                className="bg-purple-900 hover:bg-purple-700 text-white px-6 py-2 rounded"
                style={{ cursor: "pointer" }}
              >
                GitHub
              </button>
            </a>
          </div>

          {/* Person 2 */}
          <div className="weather-card bg-black/20 backdrop-blur-sm p-6 rounded-lg shadow text-center">
            <div className="w-32 h-32 mx-auto mb-4 rounded-full bg-gray-700 flex items-center justify-center">
              {/* Replace with <img src="/your-image.jpg" /> */}
              <span className="text-gray-400">
                <img
                  src="https://avatars.githubusercontent.com/u/128431085?v=4"
                  className="rounded-full object-cover"
                />
              </span>
            </div>
            <h3 className="text-xl font-semibold">Thomas Goddard</h3>
            <p className="text-gray-400">Frontend Developer</p>
            <p className="text-gray-400">Video game enthusiast.</p>

            <a href="https://github.com/Flexproc" target="_blank">
              <button
                className="bg-purple-800 hover:bg-purple-700 text-white px-6 py-2 rounded"
                style={{ cursor: "pointer" }}
              >
                GitHub
              </button>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

/** Main function of the app. */
function MyApp() {
  return (
    <BrowserRouter>
      <div>
        {/** Header starts here */}
        <header>
          <NavBar />
        </header>

        {/** Main starts here */}
        <main>
          <Banner />
          <Routes>
            {/** Updates the page by changing components */}
            <Route path="/" element={<Weather />} />
            <Route path="/report" element={<Report />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>

        {/** Footer starts here */}
        <footer>
          <BottomBar />
        </footer>
      </div>
    </BrowserRouter>
  );
}

export default MyApp;
