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
      if (!!this.logStatusSocket) {
        this.logStatusSocket.complete();
      }
      this.logStatusSocket = webSocket('ws://149.56.25.24:8084/logstatus');
      this.logStatusStream = this.logStatusSocket.pipe(
        tap({
          error: error => {
            console.log(error);
            console.log('lost connection to service... retry in 5s');
            this.logStatusSocket.unsubscribe();
            setTimeout(() => {
              console.log('retrying...');
              this.connectToLogStatus();
            }, 5000);
          },
        }), catchError(_ => EMPTY));
    }
  }

  public connectToLogStreamer(node: string, lines: number): void {
    if (!!this.logStreamSocket) {
      this.logStreamSocket.unsubscribe();
    }
    if (!this.logStreamSocket || this.logStreamSocket.closed) {
      this.logStreamSocket = webSocket({
        url: 'ws://149.56.25.24:8084/streamlog?node=' + node + '&lines=' + lines.toString(),
        deserializer: msg => msg.data,
      });
      console.log(this.logStreamSocket.subscribe())
      this.logStream = this.logStreamSocket.pipe(
        tap({
          error: error => {
            console.log(error);
            console.log('lost connection to service... retry in 2s');
            this.logStreamSocket.unsubscribe();
            setTimeout(() => {
              console.log('retrying...');
              this.connectToLogStreamer(node, 0);
            }, 2000);
          },
        }), catchError(_ => EMPTY));
    }
  }


}
