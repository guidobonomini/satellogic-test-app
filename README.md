# Satellogic Test App

A React-based typescript application that integrates mapping and satellite imagery features using `react-leaflet` and APIs for retrieving archive captures and future opportunities.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Features

- **Search in Map**: A search view that uses `react-leaflet` for displaying maps and markers with location search functionality.
- **Imagery Viewer**: View recent and archived satellite captures in a carousel or timeline view.
- **Future Opportunities**: Displays future satellite capture opportunities with confidence levels.
- **Responsive UI**: Designed to work across devices and screen sizes.

---

## Prerequisites

- Node.js (>= 16.x recommended)
- npm (or yarn)
- Docker (for running via containers)
- Docker Compose (for multi-service setup)
- Python 3.6 (if not using docker)

---

## Local Development

### Setup

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/satellogic-test-app.git
   cd satellogic-test-app
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm install
   ```

Open http://localhost:3000 to view the app in the browser. The page will reload if you make edits.

## Backend API Overview

The backend API is built using **FastAPI** and provides endpoints to retrieve recent captures, archived captures, and future satellite capture opportunities based on geographical coordinates.

### Base URL

The API is hosted at `http://localhost:4000`.

---

### Endpoints

#### 1. `/search`
**Description**: Search for nearby satellite captures within a specified radius.

- **Method**: `GET`
- **Query Parameters**:
  - `lat` (float): Latitude of the location point (required).
  - `lon` (float): Longitude of the location point (required).
  - `radius_km` (float): Radius in kilometers to filter results (default: 50 km).
- **Response**: List of recent captures within the specified radius.
  ```json
  [
    {
      "captureId": "CAP12346",
      "location": { "lat": -34.6037, "lon": -58.3816 },
      "captureDate": "2023-11-01T10:15:30Z",
      "resolution": "5m"
    }
  ]
  ```

#### 2. `/archive`
**Description**: Retrieve archived satellite captures for a given location.

- **Method**: `GET`
- **Query Parameters**:
  - `lat` (float): Latitude of the location point (required).
  - `lon` (float): Longitude of the location point (required).
  - `radius_km` (float): Radius in kilometers to filter results (default: 50 km).
- **Response**: A FeatureCollection containing archived captures within the specified radius.
  ```json
  {
    "type": "FeatureCollection",
    "features": [
      {
        "type": "Feature",
        "geometry": { "type": "Point", "coordinates": [-58.3816, -34.6037] },
        "properties": {
          "captureId": "CAP12346",
          "captureDate": "2023-11-01T10:15:30Z",
          "resolution": "5m"
        }
      }
    ]
  }
  ```

#### 3. `/opportunities`
**Description**: Retrieve future satellite capture opportunities for a given location.

- **Method**: `GET`
- **Query Parameters**:
  - `lat` (float): Latitude of the location point (required).
  - `lon` (float): Longitude of the location point (required).
  - `radius_km` (float): Radius in kilometers to filter results (default: 50 km).
- **Response**: List of future opportunities with estimated capture dates and confidence levels.
  ```json
  [
    {
      "opportunityId": "OP12346",
      "estimatedCaptureDate": "2023-12-01T08:00:00Z",
      "confidence": "High"
    }
  ]
  ```


### Running the api without Docker

To start the FastAPI backend server:

1. Navigate to the backend directory.

2. Run the following commands:

    ```bash
    pip install -r requirements.txt
    uvicorn main:app --reload
    ```


## Running tests

#### Run tests in interactive watch mode:
   ```bash
   npm test
   ```

#### Run tests in coverage mode:

   ```bash
   npm test -- --coverage
   ```


## Building and Running with Docker

#### Build and run docker compose:
   ```bash
   docker-compose up --build
   ```

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000