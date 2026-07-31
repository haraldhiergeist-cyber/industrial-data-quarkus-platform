import { Injectable } from '@angular/core';
import { interval, Observable } from 'rxjs';
import { startWith, switchMap } from 'rxjs/operators';
import { PlcQueryControllerService, PlcReadingEvent } from '../../api';

@Injectable({
  providedIn: 'root'
})
export class PlcPollingService {
  constructor(private plcApi: PlcQueryControllerService) {}

  watchAll(intervalMs = 1000): Observable<PlcReadingEvent[]> {
    return interval(intervalMs).pipe(
      startWith(0),
      switchMap(() =>
        this.plcApi.getAll('body', false, {
          httpHeaderAccept: 'application/json' as any
        })
      )
    );
  }

  loadOnce(): Observable<PlcReadingEvent[]> {
    return this.plcApi.getAll('body', false, {
      httpHeaderAccept: 'application/json' as any
    });
  }
}