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
    this.route.queryParams.subscribe(params => {
      console.log(params.node,params.lines);
      let lines = 0;
      if (!!params.lines) {
        lines = params.lines
      }
      setTimeout(() => {
        backend.connectToLogStreamer(params.node,lines);
        backend.logStream.subscribe(log => {
          setTimeout(() => {
            this.logItem.push(log);
          }, 50);
        });
      }, 500);
    });
    this.logItem.pop();

  }

  ngOnInit(): void {

  }

}
