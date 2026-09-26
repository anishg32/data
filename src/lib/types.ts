// Core types for DATAWAVE

export type DataType = 'REPORTED' | 'ESTIMATED' | 'CALCULATED' | 'UNAVAILABLE';

export type EntityCategory =
  | 'APP'
  | 'PRODUCT'
  | 'MOVIE'
  | 'GAME'
  | 'COMPANY'
  | 'SERVICE'
  | 'WEBSITE'
  | 'TV_SHOW';

export interface Source {
  id: string;
  name: string;
  url: string;
  collectionDate: string;
  dataPeriod: string;
  publicationDate: string;
  dataType: DataType;
  confidence: number; // 0-1
}

export interface MetricValue {
  value: number | null;
  unit: string;
  date: string;
  source: Source;
  dataType: DataType;
  formattedValue: string;
}

export interface CountryMetric {
  countryCode: string;
  countryName: string;
  metrics: Record<string, MetricValue>;
}

export interface TimeSeriesPoint {
  date: string;
  value: number;
  dataType: DataType;
}

export interface EntityMetric {
  id: string;
  name: string;
  description: string;
  globalValue: MetricValue | null;
  countryValues: CountryMetric[];
  timeSeries: TimeSeriesPoint[];
  category: string;
}

export interface Entity {
  id: string;
  name: string;
  category: EntityCategory;
  description: string;
  logo: string;
  color: string;
  gradient: string;
  globalMetrics: EntityMetric[];
  countriesAvailable: number;
  lastUpdated: string;
  sources: Source[];
}

export interface Country {
  code: string;
  name: string;
  region: string;
  lat: number;
  lng: number;
  population: number;
}

export interface ComparisonItem {
  entity: Entity;
  countries: string[];
}

export interface SearchResult {
  id: string;
  name: string;
  category: EntityCategory;
  description: string;
  logo: string;
  countriesAvailable: number;
  lastUpdated: string;
}

export interface WatchlistItem {
  entityId: string;
  addedAt: string;
}

export interface InsightData {
  keyFinding: string;
  whyItMatters: string;
  dataLimitation: string;
  generatedFrom: string[];
}
