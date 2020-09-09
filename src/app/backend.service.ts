import { Injectable } from '@angular/core';
import { webSocket, WebSocketSubject, WebSocketSubjectConfig } from 'rxjs/webSocket';
import { environment } from '../environments/environment';
import { catchError, tap, switchAll } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { EMPTY, Subject } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class BackendService {

  constructor() { }

  private logStatusSocket: WebSocketSubject<any>;
  private messagesSubject$ = new Subject();
  public messages$ = this.messagesSubject$.pipe(switchAll(), catchError(e => { throw e; }));
  public logStatusStream: Observable<any>;

  public connectToLogStatus(): void {
    if (!this.logStatusSocket || this.logStatusSocket.closed) {
      this.logStatusSocket = this.getNewWebSocket('ws://149.56.25.24:8084/logstatus');
      this.logStatusStream = this.logStatusSocket.pipe(
        tap({
          error: error => console.log(error),
        }), catchError(_ => EMPTY));
      this.messagesSubject$.next(this.logStatusStream);
    }
  }

  private getNewWebSocket(url: string): WebSocketSubject<any> {
    return webSocket(url);
  }
  sendMessage(msg: any): void {
    this.logStatusSocket.next(msg);
  }
  close(): void {
    this.logStatusSocket.complete();
  }
}
