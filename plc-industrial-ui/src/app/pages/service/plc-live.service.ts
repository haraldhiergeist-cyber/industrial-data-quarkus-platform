import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { PlcReadingEvent } from '../../api';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class PlcLiveService {
  private socket?: WebSocket;
  private reconnectTimer?: ReturnType<typeof setTimeout>;
  private explicitlyDisconnected = false;
  private readonly readingEventsSubject = new Subject<PlcReadingEvent>();

  readonly readingEvents$ = this.readingEventsSubject.asObservable();

  connect(): void {
    if (
      this.socket?.readyState === WebSocket.OPEN ||
      this.socket?.readyState === WebSocket.CONNECTING
    ) {
      return;
    }

    this.explicitlyDisconnected = false;
    this.openSocket();
  }

  disconnect(): void {
    this.explicitlyDisconnected = true;
    if (this.reconnectTimer) {
      clearTimeout(this.reconnectTimer);
      this.reconnectTimer = undefined;
    }
    this.socket?.close(1000, 'Client disconnect');
    this.socket = undefined;
  }

  private openSocket(): void {
    const wsUrl = environment.apiBasePath
      .replace(/^http:/, 'ws:')
      .replace(/^https:/, 'wss:') + '/ws';

    const socket = new WebSocket(wsUrl);
    this.socket = socket;

    socket.onopen = () => console.log('WebSocket connected');

    socket.onmessage = (message: MessageEvent<string>) => {
      try {
        this.readingEventsSubject.next(JSON.parse(message.data) as PlcReadingEvent);
      } catch (error) {
        console.error('Invalid PLC WebSocket message', error, message.data);
      }
    };

    socket.onerror = (event) => console.error('WebSocket error', event);

    socket.onclose = (event) => {
      console.warn('WebSocket closed', event.code, event.reason);
      this.socket = undefined;
      if (!this.explicitlyDisconnected) {
        this.reconnectTimer = setTimeout(() => this.openSocket(), 5000);
      }
    };
  }
}
