# Environmental Monitor Backend (wip)

A fullstack monorepo with a C# ASP.NET backend and a React frontend built with Vite.

Merged from the [backend](https://github.com/alex-jns/environmental-monitor-backend) and [frontend](https://github.com/alex-jns/environmental-monitor-frontend) repositories.

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

TBD
3. Verify that the OpenMeteo API is accessible and that the API parameters (latitude, longitude, time zone) are correctly configured.
4. Ensure that the time interval and time range inputs are valid and in the correct format.
5. Check for any file I/O issues when writing JSON files or generating reports, such as permission issues or insufficient disk space.
