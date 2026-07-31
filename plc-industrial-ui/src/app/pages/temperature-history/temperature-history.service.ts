import { Injectable, inject } from '@angular/core';
import { map, Observable } from 'rxjs';

import { PlcHistoryControllerService } from '../../api/api/plcHistoryController.service';
import { HistoryPoint } from '../../api/model/historyPoint';

export interface TemperatureHistoryItem {
  timestamp: string;
  value: number;
}

@Injectable({
  providedIn: 'root'
})
export class TemperatureHistoryService {
  private readonly plcHistoryControllerService = inject(PlcHistoryControllerService);

 getTemperatureHistory(): Observable<TemperatureHistoryItem[]> {
  return this.plcHistoryControllerService.temperature('body', false, {
    httpHeaderAccept: 'application/json' as any
  }).pipe(
    map((points: HistoryPoint[]) => {
      return points.map(point => ({
        timestamp: point.timestamp ?? '',
        value: Number(point.value ?? 0)
      }));
    })
  );
}
}