import { Injectable, computed, signal } from '@angular/core';
import { Subscription } from 'rxjs';
import { PlcReadingEvent } from '../../api';
import { PlcPollingService } from './plc-polling.service';
import { PlcLiveService } from './plc-live.service';

@Injectable({
  providedIn: 'root'
})
export class PlcDashboardFacade {
  private pollingSub?: Subscription;
  private liveSub?: Subscription;

  readonly readings = signal<PlcReadingEvent[]>([]);
  readonly loading = signal(false);
  readonly error = signal<string | null>(null);

  readonly readingMap = computed(() => {
    const map: Record<string, PlcReadingEvent> = {};
    for (const reading of this.readings()) {
      if (reading.tagName) {
        map[reading.tagName] = reading;
      }
    }
    return map;
  });

  readonly temperature = computed(() => this.readingMap()['temperature']);
  readonly pressure = computed(() => this.readingMap()['pressure']);
  readonly level = computed(() => this.readingMap()['level']);

  constructor(
    private pollingService: PlcPollingService,
    private liveService: PlcLiveService
  ) {}

  start(): void {
    this.stop();

    this.loading.set(true);
    this.error.set(null);

    this.pollingSub = this.pollingService.loadOnce().subscribe({
      next: (data) => {
        this.readings.set(Array.isArray(data) ? data : []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Initial snapshot failed', err);
        this.error.set('Failed to load initial PLC readings');
        this.loading.set(false);
      }
    });

    this.liveSub = this.liveService.readingEvents$.subscribe({
      next: (event) => {
        this.applyLiveUpdate(event);
      },
      error: (err) => {
        console.error('Live stream failed', err);
      }
    });

    this.liveService.connect();
  }

  stop(): void {
    this.pollingSub?.unsubscribe();
    this.pollingSub = undefined;

    this.liveSub?.unsubscribe();
    this.liveSub = undefined;

    this.liveService.disconnect();
  }

  private applyLiveUpdate(event: PlcReadingEvent): void {
    const current = [...this.readings()];
    const index = current.findIndex((r) => r.tagName === event.tagName);

    if (index >= 0) {
      current[index] = event;
    } else {
      current.unshift(event);
    }

    this.readings.set(current);
  }
}