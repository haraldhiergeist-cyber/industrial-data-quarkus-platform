import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { ChartModule } from 'primeng/chart';
import { Chart } from 'chart.js';
import zoomPlugin from 'chartjs-plugin-zoom';
import { ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { UIChart } from 'primeng/chart';



Chart.register(zoomPlugin);

import {
  TemperatureHistoryItem,
  TemperatureHistoryService
} from './temperature-history.service';

@Component({
  selector: 'app-temperature-history',
  standalone: true,
  imports: [CommonModule, ChartModule, ButtonModule],
  templateUrl: './temperature-history.component.html',
  styleUrl: './temperature-history.component.scss'
})
export class TemperatureHistoryComponent implements OnInit {
  private readonly temperatureHistoryService = inject(TemperatureHistoryService);

  readonly history = signal<TemperatureHistoryItem[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');

  readonly chartData = computed(() => ({
  labels: this.history().map(item =>
    new Date(item.timestamp).toLocaleTimeString('de-DE')
  ),
 datasets: [
  {
    label: 'Temperature',
    data: this.history().map(item => item.value),
    borderColor: '#5aa9ff',
    backgroundColor: 'rgba(90, 169, 255, 0.15)',
    pointRadius: 0,
    pointHoverRadius: 5,
    borderWidth: 2,
    tension: 0.25,
    fill: true
  }
]
}));

readonly chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    mode: 'index',
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
          return `${context.dataset.label}: ${context.raw} °C`;
        }
      }
    },
    zoom: {
      pan: {
        enabled: true,
        mode: 'x',
        modifierKey: 'shift'
      },
      zoom: {
        wheel: { enabled: true },
        drag: { enabled: true },
        pinch: { enabled: true },
        mode: 'x'
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

@ViewChild('chartRef') chart: any;

resetZoom() {
  this.chart?.chart?.resetZoom();
}

  ngOnInit(): void {
    this.loadHistory();
  }

  loadHistory(): void {
    this.loading.set(true);
    this.error.set('');

    this.temperatureHistoryService.getTemperatureHistory().subscribe({
      next: data => {
         this.history.set([...data].reverse());
         this.loading.set(false);
      },
      error: err => {
        console.error('Failed to load temperature history.', err);
        this.error.set('Failed to load temperature history.');
        this.loading.set(false);
      }
    });
  }
}