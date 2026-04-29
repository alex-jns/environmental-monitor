# Environmental Monitor Backend (wip)

A fullstack monorepo with a C# ASP.NET backend and a React frontend built with Vite.

Merged from the [backend](https://github.com/alex-jns/environmental-monitor-backend) and [frontend](https://github.com/alex-jns/environmental-monitor-frontend) repositories.

## Todo

- Finish the README
- Verify accessibility requirements
- Create a presentation

## Overview

Collects, stores, and analyzes environmental sensor data such as temperature and humidity from a preconfigured Raspberry Pi. Compares the data to OpenMeteo API weather given a latitude and longitude and generates historical reports. Presents this information to the user through a user friendly website for at-a-glance updates.

## Key Features

- **Indoor Sensor Data Collection** — Collects data from connected sensors for temperature and humidity.
- **Outdoor Weather Integration** — Fetches real-time weather data from the OpenMeteo API.
- **Generates Human Readable Reports** — Creates reports summarizing the collected data for easy interpretation.
- **JSON Data Storage** — Stores raw sensor data and API responses in JSON format for further analysis and visualization.
- **Changes Over Time** — Tracks historical data to identify trends and patterns in environmental conditions over time.
- **User Friendly Interface** — Presents information to the user in an easy-to-use website.
- **Changes Location** — Provide a latitude and longitude to get weather from somewhere else in the world.
- **Save Personal Settings** — Register and login to save your often used locations.

## Quick Start

1. Clone the repository

```
git clone https://github.com/alex-jns/environmental-monitor.git
cd environmental-monitor
```

2. Add environmental variables

Create a ".env.local" file in the /frontend directory and add the key from [Clerk](https://clerk.com/) for authentication:

```
VITE_CLERK_PUBLISHABLE_KEY=your-key-here
```

3. Run the batch file

Navigate to the root folder and double click the "run.bat" file.

## Manual Start

1. Install dependencies

```bash
npm install
cd frontend
npm install
cd ..
```

2. Set up backend

```bash
cd backend
dotnet restore
cd ..
```
3. Run the frontend

```bash
cd frontend
npm run dev
```

## Usage

Upon starting the backend, endpoints are available at:

```
http://localhost:52623/api/weather
```

```
http://localhost:52623/api/reports
```

> Endpoints are used for POST but can receive GET requests.
> If no query parameters are given, it will provide default values.

The frontend can be viewed from:

```
http://localhost:5173/
```

The weather page provides a dashboard for the inside and outside weather for default locations. In order to view another location, the user must sign in and provide a latitude and longitude.

The report page provides a long term historical report by aggregating past reports into one consolidated report. If no date ranges are provided, it will default to the earliest available to the latest available dates.

The about page provides a short summary of the project and its developers.

## Credits

Background image by Rodion Kutsaiev at [Pexels.com](https://www.pexels.com/photo/red-clouds-and-sky-at-dusk-18713933/)

Weather icons provided by [Flaticon.com](https://www.flaticon.com/free-icons/weather)

Authentication provided by [Clerk.com](https://clerk.com/)

This project utilizes [TailwindCSS](https://tailwindcss.com/)

## License

This project is licensed under the MIT License.
