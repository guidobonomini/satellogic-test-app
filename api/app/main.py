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


# Mock recent captures
captures_data = [
    {"captureId": "CAP12346", "location": {"lat": -34.6037, "lon": -58.3816}, "captureDate": "2023-11-01T10:15:30Z", "resolution": "5m"},
    {"captureId": "CAP12347", "location": {"lat": -34.6094, "lon": -58.3838}, "captureDate": "2023-11-02T12:30:00Z", "resolution": "10m"},
    {"captureId": "CAP12348", "location": {"lat": 40.7128, "lon": -74.0060}, "captureDate": "2023-11-05T14:45:00Z", "resolution": "20m"},
    {"captureId": "CAP12349", "location": {"lat": 40.73061, "lon": -73.935242}, "captureDate": "2023-11-07T09:00:00Z", "resolution": "15m"}
]


# Mock archive data with 10 examples each for New York and Buenos Aires
archive_data = [
    # Buenos Aires examples
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.3816, -34.6037]}, "properties": {"captureId": "CAP12346", "captureDate": "2023-11-01T10:15:30Z", "resolution": "5m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.3838, -34.6094]}, "properties": {"captureId": "CAP12347", "captureDate": "2023-11-02T12:30:00Z", "resolution": "10m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.3870, -34.6012]}, "properties": {"captureId": "CAP12350", "captureDate": "2023-11-03T15:00:00Z", "resolution": "8m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.3800, -34.6000]}, "properties": {"captureId": "CAP12351", "captureDate": "2023-11-04T11:00:00Z", "resolution": "12m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.4000, -34.5900]}, "properties": {"captureId": "CAP12352", "captureDate": "2023-11-05T16:30:00Z", "resolution": "15m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.4050, -34.5850]}, "properties": {"captureId": "CAP12353", "captureDate": "2023-11-06T09:45:00Z", "resolution": "20m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.4100, -34.5800]}, "properties": {"captureId": "CAP12354", "captureDate": "2023-11-07T18:30:00Z", "resolution": "18m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.4200, -34.5750]}, "properties": {"captureId": "CAP12355", "captureDate": "2023-11-08T14:00:00Z", "resolution": "7m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.4300, -34.5700]}, "properties": {"captureId": "CAP12356", "captureDate": "2023-11-09T20:00:00Z", "resolution": "9m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-58.4400, -34.5650]}, "properties": {"captureId": "CAP12357", "captureDate": "2023-11-10T08:15:00Z", "resolution": "6m"}},
    # New York examples
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-74.0060, 40.7128]}, "properties": {"captureId": "CAP12348", "captureDate": "2023-11-05T14:45:00Z", "resolution": "20m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-73.935242, 40.73061]}, "properties": {"captureId": "CAP12349", "captureDate": "2023-11-07T09:00:00Z", "resolution": "15m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-73.9200, 40.7500]}, "properties": {"captureId": "CAP12358", "captureDate": "2023-11-08T12:00:00Z", "resolution": "10m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-73.9150, 40.7600]}, "properties": {"captureId": "CAP12359", "captureDate": "2023-11-09T16:45:00Z", "resolution": "12m"}},
    {"type": "Feature", "geometry": {"type": "Point", "coordinates": [-73.9100, 40.7700]}, "properties": {"captureId": "CAP12360", "captureDate": "2023-11-10T19:30:00Z", "resolution": "8m"}},
]

# Future opportunities data
opportunities_data = [
    # Buenos Aires opportunities
    {"opportunityId": "OP12346", "estimatedCaptureDate": "2023-12-01T08:00:00Z", "confidence": "High", "location": {"lat": -34.6037, "lon": -58.3816}},
    {"opportunityId": "OP12347", "estimatedCaptureDate": "2023-12-03T10:00:00Z", "confidence": "Medium", "location": {"lat": -34.6094, "lon": -58.3838}},
    {"opportunityId": "OP12348", "estimatedCaptureDate": "2023-12-05T12:00:00Z", "confidence": "Low", "location": {"lat": -34.6012, "lon": -58.3870}},
    {"opportunityId": "OP12349", "estimatedCaptureDate": "2023-12-07T14:00:00Z", "confidence": "High", "location": {"lat": -34.6000, "lon": -58.3800}},
    {"opportunityId": "OP12350", "estimatedCaptureDate": "2023-12-09T16:00:00Z", "confidence": "Medium", "location": {"lat": -34.5900, "lon": -58.4000}},

    # New York opportunities
    {"opportunityId": "OP12351", "estimatedCaptureDate": "2023-12-11T08:00:00Z", "confidence": "High", "location": {"lat": 40.7128, "lon": -74.0060}},
    {"opportunityId": "OP12352", "estimatedCaptureDate": "2023-12-13T10:00:00Z", "confidence": "Medium", "location": {"lat": 40.73061, "lon": -73.935242}},
    {"opportunityId": "OP12353", "estimatedCaptureDate": "2023-12-15T12:00:00Z", "confidence": "Low", "location": {"lat": 40.7500, "lon": -73.9200}},
    {"opportunityId": "OP12354", "estimatedCaptureDate": "2023-12-17T14:00:00Z", "confidence": "High", "location": {"lat": 40.7600, "lon": -73.9150}},
    {"opportunityId": "OP12355", "estimatedCaptureDate": "2023-12-19T16:00:00Z", "confidence": "Medium", "location": {"lat": 40.7700, "lon": -73.9100}},
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
async def query_archive(
    lat: float = Query(..., description="Latitude of the location point."),
    lon: float = Query(..., description="Longitude of the location point."),
    radius_km: float = Query(50, description="Radius in kilometers to filter results"),
):
    # Filter archive data based on proximity
    filtered_features = [
        feature
        for feature in archive_data
        if haversine(lat, lon, feature["geometry"]["coordinates"][1], feature["geometry"]["coordinates"][0]) <= radius_km
    ]
    
    # Construct the filtered FeatureCollection response
    return {"type": "FeatureCollection", "features": filtered_features}
    

@app.get("/opportunities", response_model=List[Opportunity], summary="Get future capture opportunities")
async def future_opportunities(
    lat: float = Query(..., description="Latitude of the location point."),
    lon: float = Query(..., description="Longitude of the location point."),
    radius_km: float = Query(50, description="Radius in kilometers to filter results"),
):
    # Filter opportunities based on proximity
    filtered_opportunities = [
        opportunity
        for opportunity in opportunities_data
        if haversine(lat, lon, opportunity.get("location", {}).get("lat", 0), opportunity.get("location", {}).get("lon", 0)) <= radius_km
    ]
    return filtered_opportunities

