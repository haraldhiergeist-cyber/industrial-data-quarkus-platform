import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { MeasurementHistoryControllerService } from '../../api/api/measurementHistoryController.service';
import { MeasurementHistoryItem, MetricType, TimeRange } from './measurement.types';

@Injectable({
  providedIn: 'root'
})
export class MeasurementsFacade {
  private readonly api = inject(MeasurementHistoryControllerService);

  getMeasurementHistory(
    metric: MetricType,
    range: TimeRange
  ): Observable<MeasurementHistoryItem[]> {
    return this.api.measurements(metric, range).pipe(
      map(points =>
        points.map(point => ({
          timestamp: point.timestamp ?? '',
          value: Number(point.value ?? 0)
        }))
      )
    );
  }
}