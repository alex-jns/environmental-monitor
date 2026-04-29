# Environmental Monitor Backend (wip)

A fullstack monorepo with a C# ASP.NET backend and a React frontend built with Vite.

Merged from the [backend](https://github.com/alex-jns/environmental-monitor-backend) and [frontend](https://github.com/alex-jns/environmental-monitor-frontend) repositories.

## Todo

- Finish the README
- Add images to the "About" page
- Verify accessibility requirements
- Create a presentation
- Credits for image: https://www.pexels.com/photo/red-clouds-and-sky-at-dusk-18713933/

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

## Requirements

- Windows 10 or later (64-bit)

## Quick Start

1. Clone the repository

2. Add environmental variables

3. Run the batch file

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

The frontend can be viewed from:

```
http://localhost:5173/
```

## Credits

Background image by Rodion Kutsaiev at [Pexels.com](https://www.pexels.com/photo/red-clouds-and-sky-at-dusk-18713933/)
Weather icons provided by [Flaticon.com](https://www.flaticon.com/free-icons/weather)
