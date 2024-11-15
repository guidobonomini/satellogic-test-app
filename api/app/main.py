from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from typing import List
from pydantic import BaseModel
from datetime import datetime
from math import radians, sin, cos, sqrt, atan2

app = FastAPI()

# Allow specific origins or all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Replace with the frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

# Data models for response schemas
class CaptureLocation(BaseModel):
    lat: float
    lon: float

class Capture(BaseModel):
    captureId: str
    location: CaptureLocation
    captureDate: datetime
    resolution: str

class FeatureProperties(BaseModel):
    captureId: str
    captureDate: datetime
    resolution: str

class FeatureGeometry(BaseModel):
    type: str
    coordinates: List[float]

class Feature(BaseModel):
    type: str
    geometry: FeatureGeometry
    properties: FeatureProperties

class FeatureCollection(BaseModel):
    type: str
    features: List[Feature]

class Opportunity(BaseModel):
    opportunityId: str
    estimatedCaptureDate: datetime
    confidence: str

# Helper function to calculate the distance between two points
def haversine(lat1, lon1, lat2, lon2):
    # Convert latitude and longitude from degrees to radians
    R = 6371  # Radius of Earth in kilometers
    lat1, lon1, lat2, lon2 = map(radians, [lat1, lon1, lat2, lon2])

    # Haversine formula
    dlat = lat2 - lat1
    dlon = lon2 - lon1
    a = sin(dlat / 2) ** 2 + cos(lat1) * cos(lat2) * sin(dlon / 2) ** 2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance


# Mock database
captures_data = [
    {"captureId": "CAP12346", "location": {"lat": -34.6037, "lon": -58.3816}, "captureDate": "2023-11-01T10:15:30Z", "resolution": "5m"},
    {"captureId": "CAP12347", "location": {"lat": -34.6094, "lon": -58.3838}, "captureDate": "2023-11-02T12:30:00Z", "resolution": "10m"},
    {"captureId": "CAP12348", "location": {"lat": 40.7128, "lon": -74.0060}, "captureDate": "2023-11-05T14:45:00Z", "resolution": "20m"},
    {"captureId": "CAP12349", "location": {"lat": 40.73061, "lon": -73.935242}, "captureDate": "2023-11-07T09:00:00Z", "resolution": "15m"}
]


@app.get("/search", response_model=List[Capture], summary="Search captures based on a location point")
async def search_captures(lat: float = Query(..., description="Latitude of the location point."),
                          lon: float = Query(..., description="Longitude of the location point."),
                          radius_km: float = Query(50, description="Radius in kilometers to filter results")):
    # Filter captures based on proximity
    filtered_data = [
        capture for capture in captures_data
        if haversine(lat, lon, capture["location"]["lat"], capture["location"]["lon"]) <= radius_km
    ]
    return filtered_data


@app.get("/archive", response_model=FeatureCollection, summary="Query recent captures from the archive")
async def query_archive(lat: float = Query(..., description="Latitude of the location point."),
                        lon: float = Query(..., description="Longitude of the location point.")):
    # Mock response data
    mock_data = {
        "type": "FeatureCollection",
        "features": [
            # Buenos Aires data
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-58.3816, -34.6037]},
                "properties": {
                    "captureId": "CAP12346",
                    "captureDate": "2023-11-01T10:15:30Z",
                    "resolution": "5m"
                }
            },
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-58.3838, -34.6094]},
                "properties": {
                    "captureId": "CAP12347",
                    "captureDate": "2023-11-02T12:30:00Z",
                    "resolution": "10m"
                }
            },
            # New York data
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-74.0060, 40.7128]},
                "properties": {
                    "captureId": "CAP12348",
                    "captureDate": "2023-11-05T14:45:00Z",
                    "resolution": "20m"
                }
            },
            {
                "type": "Feature",
                "geometry": {"type": "Point", "coordinates": [-73.935242, 40.73061]},
                "properties": {
                    "captureId": "CAP12349",
                    "captureDate": "2023-11-07T09:00:00Z",
                    "resolution": "15m"
                }
            },
        ]
    }
    return mock_data

@app.get("/opportunities", response_model=List[Opportunity], summary="Get future capture opportunities")
async def future_opportunities(lat: float = Query(..., description="Latitude of the location point."),
                               lon: float = Query(..., description="Longitude of the location point.")):
    # Mock response data
    mock_data = [
        # Buenos Aires future opportunities
        {
            "opportunityId": "OP12346",
            "estimatedCaptureDate": "2023-12-01T08:00:00Z",
            "confidence": "High"
        },
        {
            "opportunityId": "OP12347",
            "estimatedCaptureDate": "2023-12-05T14:00:00Z",
            "confidence": "Medium"
        },
        # New York future opportunities
        {
            "opportunityId": "OP12348",
            "estimatedCaptureDate": "2023-12-10T12:00:00Z",
            "confidence": "High"
        },
        {
            "opportunityId": "OP12349",
            "estimatedCaptureDate": "2023-12-15T18:00:00Z",
            "confidence": "Low"
        },
    ]
    return mock_data