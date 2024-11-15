
export interface Capture {
  captureId: string;
  location: {
    lat: number;
    lon: number;
  };
  captureDate: string;
  resolution: string;
}
  
export interface FutureOpportunity {
  opportunityId: string;
  estimatedCaptureDate: string;
  confidence: string;
}
  
export interface RecentCapture {
  type: string;
  features: {
    type: string;
    geometry: {
      type: string;
      coordinates: [number, number];
    };
    properties: {
      captureId: string;
      captureDate: string;
      resolution: string;
    };
  }[];
}
  