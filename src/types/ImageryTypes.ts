
export interface Capture {
  captureId: string;
  captureDate: string;
  resolution: string;
  location: {
    lat: number;
    lon: number;
  };
}

export interface ArchiveCapture {
  type: string;
  geometry: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  properties: {
    captureId: string;
    captureDate: string;
    resolution: string;
  };
}

export interface FutureOpportunity {
  opportunityId: string;
  estimatedCaptureDate: string;
  confidence: string;
}
  