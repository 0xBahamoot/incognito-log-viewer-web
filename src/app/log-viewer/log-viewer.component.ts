import { BackendService } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss'],
})
export class LogViewerComponent implements OnInit {
  logItem: [any] = [''];
  constructor(private route: ActivatedRoute, public backend: BackendService) {
    this.route.params.subscribe(params => {
      console.log(params.id);
      setTimeout(() => {
        backend.connectToLogStreamer(params.id);
        backend.logStream.subscribe(log => {
          setTimeout(() => {
            this.logItem.push(log);
          }, 50);
        });
      }, 1000);
    });
    this.logItem.pop();

  }

  ngOnInit(): void {

  }

}
