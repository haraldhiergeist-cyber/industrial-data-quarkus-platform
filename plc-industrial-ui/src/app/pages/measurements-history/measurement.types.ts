
export interface MetricOption {
  labelKey: string;
  value: MetricType;
}

export interface TimeRangeOption {
  labelKey: string;
  value: TimeRange;
}

export function buildMetricOptions(): MetricOption[] {
  return [
    { labelKey: 'metric.temperature', value: 'TEMPERATURE' },
    { labelKey: 'metric.pressure', value: 'PRESSURE' },
    { labelKey: 'metric.level', value: 'LEVEL' }
  ];
}

export function buildTimeRangeOptions(): TimeRangeOption[] {
  return [
    { labelKey: 'timeRange.last5Minutes', value: 'LAST_5_MINUTES' },
    { labelKey: 'timeRange.last15Minutes', value: 'LAST_15_MINUTES' },
    { labelKey: 'timeRange.last1Hour', value: 'LAST_1_HOUR' },
    { labelKey: 'timeRange.last24Hours', value: 'LAST_24_HOURS' }
  ];
}

export type MetricType = 'TEMPERATURE' | 'PRESSURE' | 'LEVEL';

export type TimeRange =
  | 'LAST_5_MINUTES'
  | 'LAST_15_MINUTES'
  | 'LAST_1_HOUR'
  | 'LAST_24_HOURS';

export interface MeasurementHistoryItem {
  timestamp: string;
  value: number;
}

export interface MetricConfig {
  labelKey: string;
  unit: string;
  color: string;
  backgroundColor: string;
}

export const METRIC_CONFIG: Record<MetricType, MetricConfig> = {
  TEMPERATURE: {
    labelKey: 'metric.temperature',
    unit: '°C',
    color: '#5aa9ff',
    backgroundColor: 'rgba(90, 169, 255, 0.15)'
  },
  PRESSURE: {
    labelKey: 'metric.pressure',
    unit: 'bar',
    color: '#34d399',
    backgroundColor: 'rgba(52, 211, 153, 0.15)'
  },
  LEVEL: {
    labelKey: 'metric.level',
    unit: '%',
    color: '#f59e0b',
    backgroundColor: 'rgba(245, 158, 11, 0.15)'
  }
};