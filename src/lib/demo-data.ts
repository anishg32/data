// Demo data for DATATO - Clearly labeled as DEMO DATA
// These are illustrative values for development purposes only
// Real data should come from verified public sources

import { Entity, Country, Source, DataType } from './types';

const demoSource = (name: string, period: string, type: DataType = 'ESTIMATED'): Source => ({
  id: `src-${name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`,
  name,
  url: '#demo',
  collectionDate: '2026-09-01',
  dataPeriod: period,
  publicationDate: '2026-09-01',
  dataType: type,
  confidence: 0.5,
});

const makeMetricValue = (
  value: number | null,
  unit: string,
  date: string,
  sourceName: string,
  period: string,
  dataType: DataType = 'ESTIMATED'
) => ({
  value,
  unit,
  date,
  source: demoSource(sourceName, period, dataType),
  dataType,
  formattedValue: value !== null
    ? unit === 'USD'
      ? `$${(value / 1e9).toFixed(1)}B`
      : unit === 'users'
        ? value >= 1e9
          ? `${(value / 1e9).toFixed(1)}B`
          : value >= 1e6
            ? `${(value / 1e6).toFixed(0)}M`
            : `${(value / 1e3).toFixed(0)}K`
        : unit === '%'
          ? `${value.toFixed(1)}%`
          : value.toLocaleString()
    : 'Data unavailable',
});

export const DEMO_ENTITIES: Entity[] = [
  {
    id: 'netflix',
    name: 'Netflix',
    category: 'SERVICE',
    description: 'Global streaming entertainment service offering movies, TV series, and documentaries',
    logo: '🎬',
    color: '#E50914',
    gradient: 'from-red-600 to-red-900',
    countriesAvailable: 190,
    lastUpdated: '2026-09-20',
    sources: [demoSource('Demo Dataset', 'Q2 2026')],
    globalMetrics: [
      {
        id: 'subscribers',
        name: 'Global Subscribers',
        description: 'Total paid streaming subscribers worldwide',
        category: 'Users',
        globalValue: makeMetricValue(301_000_000, 'users', '2026-06-30', 'Demo: Company Reports', 'Q2 2026', 'ESTIMATED'),
        countryValues: [
          {
            countryCode: 'US', countryName: 'United States',
            metrics: {
              subscribers: makeMetricValue(84_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(3.2, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'IN', countryName: 'India',
            metrics: {
              subscribers: makeMetricValue(12_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(18.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'JP', countryName: 'Japan',
            metrics: {
              subscribers: makeMetricValue(7_500_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(5.1, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'GB', countryName: 'United Kingdom',
            metrics: {
              subscribers: makeMetricValue(15_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(2.8, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'BR', countryName: 'Brazil',
            metrics: {
              subscribers: makeMetricValue(20_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(12.3, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'DE', countryName: 'Germany',
            metrics: {
              subscribers: makeMetricValue(11_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(4.0, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'FR', countryName: 'France',
            metrics: {
              subscribers: makeMetricValue(10_500_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(3.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'KR', countryName: 'South Korea',
            metrics: {
              subscribers: makeMetricValue(9_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(8.7, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'AU', countryName: 'Australia',
            metrics: {
              subscribers: makeMetricValue(6_500_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(2.1, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
          {
            countryCode: 'MX', countryName: 'Mexico',
            metrics: {
              subscribers: makeMetricValue(14_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
              growth: makeMetricValue(9.8, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
            }
          },
        ],
        timeSeries: [
          { date: '2020-Q4', value: 203_000_000, dataType: 'ESTIMATED' },
          { date: '2021-Q4', value: 222_000_000, dataType: 'ESTIMATED' },
          { date: '2022-Q4', value: 231_000_000, dataType: 'ESTIMATED' },
          { date: '2023-Q4', value: 260_000_000, dataType: 'ESTIMATED' },
          { date: '2024-Q4', value: 283_000_000, dataType: 'ESTIMATED' },
          { date: '2025-Q4', value: 295_000_000, dataType: 'ESTIMATED' },
          { date: '2026-Q2', value: 301_000_000, dataType: 'ESTIMATED' },
        ],
      },
      {
        id: 'revenue',
        name: 'Annual Revenue',
        description: 'Total annual revenue',
        category: 'Financial',
        globalValue: makeMetricValue(39_000_000_000, 'USD', '2025-12-31', 'Demo: Financial Reports', 'FY 2025', 'ESTIMATED'),
        countryValues: [],
        timeSeries: [
          { date: '2020', value: 25_000_000_000, dataType: 'ESTIMATED' },
          { date: '2021', value: 29_700_000_000, dataType: 'ESTIMATED' },
          { date: '2022', value: 31_600_000_000, dataType: 'ESTIMATED' },
          { date: '2023', value: 33_700_000_000, dataType: 'ESTIMATED' },
          { date: '2024', value: 36_200_000_000, dataType: 'ESTIMATED' },
          { date: '2025', value: 39_000_000_000, dataType: 'ESTIMATED' },
        ],
      },
      {
        id: 'countries',
        name: 'Countries Available',
        description: 'Number of countries where the service is available',
        category: 'Reach',
        globalValue: makeMetricValue(190, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026', 'ESTIMATED'),
        countryValues: [],
        timeSeries: [],
      },
    ],
  },
  {
    id: 'spotify',
    name: 'Spotify',
    category: 'APP',
    description: 'Digital music, podcast and video streaming service',
    logo: '🎵',
    color: '#1DB954',
    gradient: 'from-green-500 to-green-800',
    countriesAvailable: 184,
    lastUpdated: '2026-09-18',
    sources: [demoSource('Demo Dataset', 'Q2 2026')],
    globalMetrics: [
      {
        id: 'mau',
        name: 'Monthly Active Users',
        description: 'Total monthly active users worldwide',
        category: 'Users',
        globalValue: makeMetricValue(675_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
        countryValues: [
          { countryCode: 'US', countryName: 'United States', metrics: { mau: makeMetricValue(105_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(4.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'IN', countryName: 'India', metrics: { mau: makeMetricValue(85_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(22.0, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'BR', countryName: 'Brazil', metrics: { mau: makeMetricValue(52_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(10.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'GB', countryName: 'United Kingdom', metrics: { mau: makeMetricValue(32_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(3.2, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'DE', countryName: 'Germany', metrics: { mau: makeMetricValue(28_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(3.8, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'MX', countryName: 'Mexico', metrics: { mau: makeMetricValue(38_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(14.0, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'JP', countryName: 'Japan', metrics: { mau: makeMetricValue(15_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(7.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'FR', countryName: 'France', metrics: { mau: makeMetricValue(22_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(4.1, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
        ],
        timeSeries: [
          { date: '2020-Q4', value: 345_000_000, dataType: 'ESTIMATED' },
          { date: '2021-Q4', value: 406_000_000, dataType: 'ESTIMATED' },
          { date: '2022-Q4', value: 489_000_000, dataType: 'ESTIMATED' },
          { date: '2023-Q4', value: 602_000_000, dataType: 'ESTIMATED' },
          { date: '2024-Q4', value: 640_000_000, dataType: 'ESTIMATED' },
          { date: '2025-Q4', value: 660_000_000, dataType: 'ESTIMATED' },
          { date: '2026-Q2', value: 675_000_000, dataType: 'ESTIMATED' },
        ],
      },
      {
        id: 'premium',
        name: 'Premium Subscribers',
        description: 'Total paying premium subscribers',
        category: 'Users',
        globalValue: makeMetricValue(252_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
        countryValues: [],
        timeSeries: [
          { date: '2020-Q4', value: 155_000_000, dataType: 'ESTIMATED' },
          { date: '2021-Q4', value: 180_000_000, dataType: 'ESTIMATED' },
          { date: '2022-Q4', value: 205_000_000, dataType: 'ESTIMATED' },
          { date: '2023-Q4', value: 236_000_000, dataType: 'ESTIMATED' },
          { date: '2024-Q4', value: 246_000_000, dataType: 'ESTIMATED' },
          { date: '2025-Q4', value: 250_000_000, dataType: 'ESTIMATED' },
          { date: '2026-Q2', value: 252_000_000, dataType: 'ESTIMATED' },
        ],
      },
      {
        id: 'revenue',
        name: 'Annual Revenue',
        description: 'Total annual revenue',
        category: 'Financial',
        globalValue: makeMetricValue(16_500_000_000, 'USD', '2025-12-31', 'Demo: Financial Reports', 'FY 2025', 'ESTIMATED'),
        countryValues: [],
        timeSeries: [
          { date: '2020', value: 9_700_000_000, dataType: 'ESTIMATED' },
          { date: '2021', value: 11_400_000_000, dataType: 'ESTIMATED' },
          { date: '2022', value: 13_200_000_000, dataType: 'ESTIMATED' },
          { date: '2023', value: 14_300_000_000, dataType: 'ESTIMATED' },
          { date: '2024', value: 15_700_000_000, dataType: 'ESTIMATED' },
          { date: '2025', value: 16_500_000_000, dataType: 'ESTIMATED' },
        ],
      },
    ],
  },
  {
    id: 'youtube',
    name: 'YouTube',
    category: 'WEBSITE',
    description: 'Video sharing and streaming platform',
    logo: '📺',
    color: '#FF0000',
    gradient: 'from-red-500 to-red-800',
    countriesAvailable: 100,
    lastUpdated: '2026-09-15',
    sources: [demoSource('Demo Dataset', 'Q2 2026')],
    globalMetrics: [
      {
        id: 'mau',
        name: 'Monthly Active Users',
        description: 'Estimated monthly active users worldwide',
        category: 'Users',
        globalValue: makeMetricValue(2_700_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
        countryValues: [
          { countryCode: 'US', countryName: 'United States', metrics: { mau: makeMetricValue(240_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(2.1, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'IN', countryName: 'India', metrics: { mau: makeMetricValue(500_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(12.0, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'BR', countryName: 'Brazil', metrics: { mau: makeMetricValue(145_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(8.3, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'JP', countryName: 'Japan', metrics: { mau: makeMetricValue(78_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(3.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
        ],
        timeSeries: [
          { date: '2020-Q4', value: 2_000_000_000, dataType: 'ESTIMATED' },
          { date: '2021-Q4', value: 2_200_000_000, dataType: 'ESTIMATED' },
          { date: '2022-Q4', value: 2_400_000_000, dataType: 'ESTIMATED' },
          { date: '2023-Q4', value: 2_500_000_000, dataType: 'ESTIMATED' },
          { date: '2024-Q4', value: 2_600_000_000, dataType: 'ESTIMATED' },
          { date: '2025-Q4', value: 2_650_000_000, dataType: 'ESTIMATED' },
          { date: '2026-Q2', value: 2_700_000_000, dataType: 'ESTIMATED' },
        ],
      },
    ],
  },
  {
    id: 'tesla',
    name: 'Tesla',
    category: 'COMPANY',
    description: 'Electric vehicle and clean energy company',
    logo: '⚡',
    color: '#CC0000',
    gradient: 'from-red-600 to-slate-900',
    countriesAvailable: 45,
    lastUpdated: '2026-09-22',
    sources: [demoSource('Demo Dataset', 'Q2 2026')],
    globalMetrics: [
      {
        id: 'deliveries',
        name: 'Annual Vehicle Deliveries',
        description: 'Total vehicles delivered worldwide',
        category: 'Sales',
        globalValue: makeMetricValue(2_100_000, 'users', '2025-12-31', 'Demo Dataset', 'FY 2025'),
        countryValues: [
          { countryCode: 'US', countryName: 'United States', metrics: { deliveries: makeMetricValue(820_000, 'users', '2025-12-31', 'Demo Dataset', 'FY 2025'), growth: makeMetricValue(5.2, '%', '2025-12-31', 'Demo Dataset', 'FY 2025') } },
          { countryCode: 'CN', countryName: 'China', metrics: { deliveries: makeMetricValue(650_000, 'users', '2025-12-31', 'Demo Dataset', 'FY 2025'), growth: makeMetricValue(15.0, '%', '2025-12-31', 'Demo Dataset', 'FY 2025') } },
          { countryCode: 'DE', countryName: 'Germany', metrics: { deliveries: makeMetricValue(95_000, 'users', '2025-12-31', 'Demo Dataset', 'FY 2025'), growth: makeMetricValue(8.3, '%', '2025-12-31', 'Demo Dataset', 'FY 2025') } },
          { countryCode: 'GB', countryName: 'United Kingdom', metrics: { deliveries: makeMetricValue(72_000, 'users', '2025-12-31', 'Demo Dataset', 'FY 2025'), growth: makeMetricValue(6.1, '%', '2025-12-31', 'Demo Dataset', 'FY 2025') } },
        ],
        timeSeries: [
          { date: '2020', value: 499_000, dataType: 'ESTIMATED' },
          { date: '2021', value: 936_000, dataType: 'ESTIMATED' },
          { date: '2022', value: 1_310_000, dataType: 'ESTIMATED' },
          { date: '2023', value: 1_810_000, dataType: 'ESTIMATED' },
          { date: '2024', value: 1_950_000, dataType: 'ESTIMATED' },
          { date: '2025', value: 2_100_000, dataType: 'ESTIMATED' },
        ],
      },
      {
        id: 'revenue',
        name: 'Annual Revenue',
        description: 'Total annual revenue',
        category: 'Financial',
        globalValue: makeMetricValue(97_000_000_000, 'USD', '2025-12-31', 'Demo: Financial Reports', 'FY 2025', 'ESTIMATED'),
        countryValues: [],
        timeSeries: [
          { date: '2020', value: 31_500_000_000, dataType: 'ESTIMATED' },
          { date: '2021', value: 53_800_000_000, dataType: 'ESTIMATED' },
          { date: '2022', value: 81_500_000_000, dataType: 'ESTIMATED' },
          { date: '2023', value: 96_800_000_000, dataType: 'ESTIMATED' },
          { date: '2024', value: 95_000_000_000, dataType: 'ESTIMATED' },
          { date: '2025', value: 97_000_000_000, dataType: 'ESTIMATED' },
        ],
      },
    ],
  },
  {
    id: 'instagram',
    name: 'Instagram',
    category: 'APP',
    description: 'Photo and video sharing social networking service',
    logo: '📸',
    color: '#E4405F',
    gradient: 'from-pink-500 via-purple-500 to-orange-500',
    countriesAvailable: 170,
    lastUpdated: '2026-09-19',
    sources: [demoSource('Demo Dataset', 'Q2 2026')],
    globalMetrics: [
      {
        id: 'mau',
        name: 'Monthly Active Users',
        description: 'Total monthly active users worldwide',
        category: 'Users',
        globalValue: makeMetricValue(2_400_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
        countryValues: [
          { countryCode: 'IN', countryName: 'India', metrics: { mau: makeMetricValue(360_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(15.0, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'US', countryName: 'United States', metrics: { mau: makeMetricValue(170_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(3.8, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'BR', countryName: 'Brazil', metrics: { mau: makeMetricValue(135_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(8.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
        ],
        timeSeries: [
          { date: '2020-Q4', value: 1_200_000_000, dataType: 'ESTIMATED' },
          { date: '2021-Q4', value: 1_400_000_000, dataType: 'ESTIMATED' },
          { date: '2022-Q4', value: 1_700_000_000, dataType: 'ESTIMATED' },
          { date: '2023-Q4', value: 2_000_000_000, dataType: 'ESTIMATED' },
          { date: '2024-Q4', value: 2_200_000_000, dataType: 'ESTIMATED' },
          { date: '2025-Q4', value: 2_350_000_000, dataType: 'ESTIMATED' },
          { date: '2026-Q2', value: 2_400_000_000, dataType: 'ESTIMATED' },
        ],
      },
    ],
  },
  {
    id: 'playstation',
    name: 'PlayStation',
    category: 'PRODUCT',
    description: 'Gaming console brand and digital entertainment platform',
    logo: '🎮',
    color: '#003791',
    gradient: 'from-blue-700 to-blue-950',
    countriesAvailable: 120,
    lastUpdated: '2026-09-10',
    sources: [demoSource('Demo Dataset', 'Q2 2026')],
    globalMetrics: [
      {
        id: 'ps5-sales',
        name: 'PS5 Units Sold',
        description: 'Cumulative PlayStation 5 units sold worldwide',
        category: 'Sales',
        globalValue: makeMetricValue(75_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
        countryValues: [
          { countryCode: 'US', countryName: 'United States', metrics: { sales: makeMetricValue(22_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(12.0, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'JP', countryName: 'Japan', metrics: { sales: makeMetricValue(8_500_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(6.5, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
          { countryCode: 'GB', countryName: 'United Kingdom', metrics: { sales: makeMetricValue(7_200_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'), growth: makeMetricValue(8.0, '%', '2026-06-30', 'Demo Dataset', 'Q2 2026') } },
        ],
        timeSeries: [
          { date: '2020', value: 4_500_000, dataType: 'ESTIMATED' },
          { date: '2021', value: 17_000_000, dataType: 'ESTIMATED' },
          { date: '2022', value: 32_000_000, dataType: 'ESTIMATED' },
          { date: '2023', value: 50_000_000, dataType: 'ESTIMATED' },
          { date: '2024', value: 63_000_000, dataType: 'ESTIMATED' },
          { date: '2025', value: 72_000_000, dataType: 'ESTIMATED' },
          { date: '2026-Q2', value: 75_000_000, dataType: 'ESTIMATED' },
        ],
      },
      {
        id: 'psplus',
        name: 'PS Plus Subscribers',
        description: 'PlayStation Plus subscription service members',
        category: 'Users',
        globalValue: makeMetricValue(49_000_000, 'users', '2026-06-30', 'Demo Dataset', 'Q2 2026'),
        countryValues: [],
        timeSeries: [
          { date: '2020-Q4', value: 47_400_000, dataType: 'ESTIMATED' },
          { date: '2021-Q4', value: 48_000_000, dataType: 'ESTIMATED' },
          { date: '2022-Q4', value: 45_000_000, dataType: 'ESTIMATED' },
          { date: '2023-Q4', value: 46_500_000, dataType: 'ESTIMATED' },
          { date: '2024-Q4', value: 48_000_000, dataType: 'ESTIMATED' },
          { date: '2025-Q4', value: 49_000_000, dataType: 'ESTIMATED' },
        ],
      },
    ],
  },
];

export const DEMO_COUNTRIES: Country[] = [
  { code: 'US', name: 'United States', region: 'North America', lat: 37.09, lng: -95.71, population: 331_000_000 },
  { code: 'IN', name: 'India', region: 'Asia', lat: 20.59, lng: 78.96, population: 1_428_000_000 },
  { code: 'CN', name: 'China', region: 'Asia', lat: 35.86, lng: 104.19, population: 1_425_000_000 },
  { code: 'JP', name: 'Japan', region: 'Asia', lat: 36.20, lng: 138.25, population: 125_000_000 },
  { code: 'GB', name: 'United Kingdom', region: 'Europe', lat: 55.37, lng: -3.43, population: 67_000_000 },
  { code: 'DE', name: 'Germany', region: 'Europe', lat: 51.16, lng: 10.45, population: 83_000_000 },
  { code: 'FR', name: 'France', region: 'Europe', lat: 46.22, lng: 2.21, population: 65_000_000 },
  { code: 'BR', name: 'Brazil', region: 'South America', lat: -14.23, lng: -51.92, population: 214_000_000 },
  { code: 'KR', name: 'South Korea', region: 'Asia', lat: 35.90, lng: 127.76, population: 52_000_000 },
  { code: 'AU', name: 'Australia', region: 'Oceania', lat: -25.27, lng: 133.77, population: 26_000_000 },
  { code: 'MX', name: 'Mexico', region: 'North America', lat: 23.63, lng: -102.55, population: 128_000_000 },
  { code: 'CA', name: 'Canada', region: 'North America', lat: 56.13, lng: -106.34, population: 38_000_000 },
  { code: 'IT', name: 'Italy', region: 'Europe', lat: 41.87, lng: 12.56, population: 60_000_000 },
  { code: 'ES', name: 'Spain', region: 'Europe', lat: 40.46, lng: -3.74, population: 47_000_000 },
  { code: 'NG', name: 'Nigeria', region: 'Africa', lat: 9.08, lng: 8.67, population: 218_000_000 },
  { code: 'ZA', name: 'South Africa', region: 'Africa', lat: -30.56, lng: 22.93, population: 60_000_000 },
  { code: 'RU', name: 'Russia', region: 'Europe', lat: 61.52, lng: 105.31, population: 146_000_000 },
  { code: 'ID', name: 'Indonesia', region: 'Asia', lat: -0.78, lng: 113.92, population: 275_000_000 },
  { code: 'SA', name: 'Saudi Arabia', region: 'Middle East', lat: 23.88, lng: 45.07, population: 36_000_000 },
  { code: 'AE', name: 'UAE', region: 'Middle East', lat: 23.42, lng: 53.84, population: 10_000_000 },
];

export function searchEntities(query: string): Entity[] {
  if (!query.trim()) return DEMO_ENTITIES;
  const q = query.toLowerCase();
  return DEMO_ENTITIES.filter(
    (e) =>
      e.name.toLowerCase().includes(q) ||
      e.category.toLowerCase().includes(q) ||
      e.description.toLowerCase().includes(q)
  );
}

export function getEntityById(id: string): Entity | undefined {
  return DEMO_ENTITIES.find((e) => e.id === id);
}

export function getCountryByCode(code: string): Country | undefined {
  return DEMO_COUNTRIES.find((c) => c.code === code);
}
