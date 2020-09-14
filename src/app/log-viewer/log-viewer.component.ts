import { BackendService } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss'],
})
export class LogViewerComponent implements OnInit {
  logItem: string[] = [];
  filterLogItem: string[] = [];
  filterString = '';
  node:'';
  constructor(private route: ActivatedRoute, public backend: BackendService) {
    this.route.queryParams.subscribe(params => {
      let lines = 0;
      if (!!params.lines) {
        lines = params.lines;
      }
      this.node = params.node;
      setTimeout(() => {
        backend.connectToLogStreamer(params.node, lines);
        backend.logStream.subscribe(log => {
          this.logItem.push(log);
          if (this.filterString !== '') {
            console.log(this.filterString);
            if (log.toLowerCase().includes(this.filterString)) {
              this.filterLogItem.push(log);
            }
          }
        });
      }, 500);

    });
  }

  ngOnInit(): void {

  }

  filterLines(f: any): void {
    if (f.code === 'Enter') {
      this.filterString = '';
      this.filterLogItem = new Array<string>();
      this.logItem.forEach((item: string) => {
        if (item.toLowerCase().includes(f.target.value.toLowerCase())) {
          this.filterLogItem.push(item);
        }
      });
      this.filterString = f.target.value.toLowerCase();
    }
  }

  filter(key: string):void {
    this.filterString = '';
      this.filterLogItem = new Array<string>();
      this.logItem.forEach((item: string) => {
        if (item.toLowerCase().includes(key)) {
          this.filterLogItem.push(item);
        }
      });
      this.filterString = key;
  }
}
