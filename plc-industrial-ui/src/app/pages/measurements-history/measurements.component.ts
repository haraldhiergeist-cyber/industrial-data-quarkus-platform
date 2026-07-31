import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { TranslationService } from '@/app/core/i18n/translation.service';
import { LanguageService } from '@/app/core/i18n/language.service';
import { buildMetricOptions, buildTimeRangeOptions } from './measurement.types';
import {
  Component,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { ButtonModule } from 'primeng/button';
import { ChartModule, UIChart } from 'primeng/chart';
import { SelectModule } from 'primeng/select';

import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { TranslatePipe } from '@/app/core/i18n/translate.pipe';

import { MeasurementsFacade } from './measurements.facade';
import {
  METRIC_CONFIG,
  MeasurementHistoryItem,
  MetricOption,
  MetricType,
  TimeRange,
  TimeRangeOption
} from './measurement.types';

Chart.register(zoomPlugin);

@Component({
  selector: 'app-measurements',
  standalone: true,
  imports: [CommonModule, FormsModule, ChartModule, SelectModule, ButtonModule, TranslatePipe],
  templateUrl: './measurements.component.html',
  styleUrl: './measurements.component.scss'
})
export class MeasurementsComponent implements OnInit {
  private readonly measurementsFacade = inject(MeasurementsFacade);

  @ViewChild('chartRef') chart: UIChart | undefined;

  readonly history = signal<MeasurementHistoryItem[]>([]);
  readonly loading = signal(false);
  readonly errorKey = signal('');
  readonly errorDetails = signal('');

  readonly selectedMetric = signal<MetricType>('TEMPERATURE');
  readonly selectedRange = signal<TimeRange>('LAST_1_HOUR');

  

  readonly metricConfig = computed(() => METRIC_CONFIG[this.selectedMetric()]);

  readonly stats = computed(() => {
    const items = this.history();

    if (!items.length) {
      return {
        current: undefined as number | undefined,
        min: undefined as number | undefined,
        max: undefined as number | undefined,
        average: undefined as number | undefined
      };
    }

    const values = items.map(item => item.value);
    const sum = values.reduce((acc, value) => acc + value, 0);

    return {
      current: values[values.length - 1],
      min: Math.min(...values),
      max: Math.max(...values),
      average: Number((sum / values.length).toFixed(2))
    };
  });

  readonly chartData = computed(() => {
  const config = this.metricConfig();

  return {
    labels: this.history().map(item =>
      new Date(item.timestamp).toLocaleTimeString('en-GB')
    ),
    datasets: [
      {
        label: this.translationService.translate(config.labelKey),
        data: this.history().map(item => item.value),
        borderColor: config.color,
        backgroundColor: config.backgroundColor,
        pointRadius: 0,
        pointHoverRadius: 5,
        borderWidth: 2,
        tension: 0.25,
        fill: true
      }
    ]
  };
});

  readonly chartOptions = computed(() => {
    const config = this.metricConfig();

    return {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index' as const,
        intersect: false
      },
      plugins: {
        legend: {
          labels: {
            color: '#d1d5db'
          }
        },
        tooltip: {
          callbacks: {
            label: function (context: any) {
              return `${context.dataset.label}: ${context.raw} ${config.unit}`;
            }
          }
        },
        zoom: {
          pan: {
            enabled: true,
            mode: 'x' as const,
            modifierKey: 'shift' as const
          },
          zoom: {
            wheel: {
              enabled: true
            },
            drag: {
              enabled: true
            },
            pinch: {
              enabled: true
            },
            mode: 'x' as const
          }
        }
      },
      scales: {
        x: {
          ticks: {
            color: '#9ca3af',
            maxTicksLimit: 8,
            autoSkip: true
          },
          grid: {
            display: false
          }
        },
        y: {
          ticks: {
            color: '#cbd5f5'
          },
          grid: {
            color: 'rgba(255,255,255,0.08)'
          }
        }
      }
    };
  });

metricOptions: MetricOption[] = [];
timeRangeOptions: TimeRangeOption[] = [];

translationService = inject(TranslationService);
languageService = inject(LanguageService);

 async ngOnInit(): Promise<void> {
  await this.translationService.init();

  this.metricOptions = buildMetricOptions();
  this.timeRangeOptions = buildTimeRangeOptions();

  this.loadHistory();
}

  onMetricChange(metric: MetricType): void {
    this.selectedMetric.set(metric);
    this.loadHistory();
  }

  onRangeChange(range: TimeRange): void {
    this.selectedRange.set(range);
    this.loadHistory();
  }

  resetZoom(): void {
    this.chart?.chart?.resetZoom();
  }

  private loadHistory(): void {
  this.loading.set(true);
   this.errorKey.set('');
   this.errorDetails.set('');

  this.measurementsFacade
    .getMeasurementHistory(this.selectedMetric(), this.selectedRange())
    .subscribe({
      next: data => {
        this.history.set(data);
        this.loading.set(false);
        queueMicrotask(() => this.resetZoom());
      },
      error: err => {
        console.error('Failed to load measurement history', err);
        this.errorKey.set('measurements.loadError');
        this.errorDetails.set(this.formatErrorDetails(err));
        this.loading.set(false);
      }
    });
 }

  private formatErrorDetails(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      return JSON.stringify(
        {
          status: err.status,
          statusText: err.statusText,
          url: err.url,
          message: err.message,
          error: typeof err.error === 'string' ? err.error : err.error ?? null
        },
        null,
        2
      );
    }

    if (err instanceof Error) {
      return err.message;
    }

    return JSON.stringify(err, null, 2);
  }
}
