import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { catchError, tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EMPTY } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }

  private logStatusSocket: WebSocketSubject<any>;
  public logStatusStream: Observable<any>;
  private logStreamSocket: WebSocketSubject<any>;
  public logStream: Observable<any>;

  public connectToLogStatus(): void {
    if (!this.logStatusSocket || this.logStatusSocket.closed) {
      this.logStatusSocket = webSocket('ws://149.56.25.24:8084/logstatus');
      this.logStatusStream = this.logStatusSocket.pipe(
        tap({
          error: error => {
            console.log(error);
            console.log('lost connection to service... retry in 5s');
            this.logStatusSocket.complete();
            setTimeout(() => {
              console.log('retrying...');
              this.connectToLogStatus();
            }, 5000);
          },
        }), catchError(_ => EMPTY));
    }
  }

  public connectToLogStreamer(node: string): void {
    if (!this.logStreamSocket || this.logStreamSocket.closed) {
      this.logStreamSocket = webSocket({
        url: 'ws://149.56.25.24:8084/streamlog?node=' + node,
        deserializer: msg => msg.data,
      });
      this.logStream = this.logStreamSocket.pipe(
        tap({
          error: error => {
            console.log(error);
            console.log('lost connection to service... retry in 2s');
            this.logStreamSocket.complete();
            setTimeout(() => {
              console.log('retrying...');
              this.connectToLogStreamer(node);
            }, 2000);
          },
        }), catchError(_ => EMPTY));
    }
  }


}
