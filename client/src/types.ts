export interface Region {
  _id: string;
  name: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  cropType?: string;
  status?: string;
  latestNDVI?: number;
  trend?: string;
}

export interface NDVIRecord {
  date: string;
  ndvi: number;
}

export interface RegionHealth {
  regionName: string;
  latestNDVI: number;
  status: string;
  history: NDVIRecord[];
}
