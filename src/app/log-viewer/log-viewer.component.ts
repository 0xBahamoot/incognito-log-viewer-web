import { BackendService } from './../backend.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss'],
})
export class LogViewerComponent implements OnInit {
  logItem: string[] = [];
  filterLogItem: string[] = [];
  filterString = '';
  consensusItem: string[] = [];
  filterconsensusItem: string[] = [];
  filterconsensusString = '';
  logMode: boolean = true;
  node: '';
  lines: number = 0;

  availiableHeights: any[];
  selectedHeight: number = 0;

  constructor(private route: ActivatedRoute, public backend: BackendService) {
    this.availiableHeights = new Array<any>();
    this.route.queryParams.subscribe(params => {
      if (!!params.lines) {
        this.lines = params.lines;
      }
      this.node = params.node;
      setTimeout(() => {
        backend.connectToLogStreamer(this.node, this.lines);
        backend.logStream.subscribe(log => {
          this.logItem.push(log);
          if (this.filterString !== '') {
            if (log.toLowerCase().includes(this.filterString)) {
              this.filterLogItem.push(log);
            }
          }
        });
      }, 500);
    });
    setTimeout(() => {
      this.getConsensusHeights();
    }, 2000);
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

  filter(key: string): void {
    this.filterString = '';
    this.filterLogItem = new Array<string>();
    this.logItem.forEach((item: string) => {
      if (item.toLowerCase().includes(key)) {
        this.filterLogItem.push(item);
      }
    });
    this.filterString = key;
  }

  linesBeforeStream(f: any): void {
    if (f.code === 'Enter') {
      this.filterString = '';
      this.filterLogItem = new Array<string>();
      this.logItem = new Array<string>();
      this.lines = parseInt(f.target.value);
      this.backend.connectToLogStreamer(this.node, this.lines);
      this.backend.logStream.subscribe(log => {
        this.logItem.push(log);
        if (this.filterString !== '') {
          if (log.toLowerCase().includes(this.filterString)) {
            this.filterLogItem.push(log);
          }
        }
      });
    }
  }

  getConsensusHeights(): void {
    this.backend.getHeightLog(this.node).subscribe(response => {
      this.availiableHeights = response;
      return;
    });
  }


  resetHeight(): void {
    this.selectedHeight = 0;
    this.filterconsensusString = '';
    this.filterconsensusItem = new Array<string>();
    this.consensusItem = new Array<string>();
  }

  getConsensusHeightLog(height: number): void {
    this.selectedHeight = height;
    this.filterconsensusString = '';
    this.filterconsensusItem = new Array<string>();
    this.consensusItem = new Array<string>();

    this.backend.connectToConsensusStreamer(this.node, height);
    this.backend.consensusStream.subscribe(log => {
      this.consensusItem.push(log);
      if (this.filterString !== '') {
        if (log.toLowerCase().includes(this.filterString)) {
          this.filterconsensusItem.push(log);
        }
      }
    });
  }

  filterConsensusLines(f: any): void {
    if (f.code === 'Enter') {
      this.filterconsensusString = '';
      this.filterconsensusItem = new Array<string>();
      this.consensusItem.forEach((item: string) => {
        if (item.toLowerCase().includes(f.target.value.toLowerCase())) {
          this.filterconsensusItem.push(item);
        }
      });
      this.filterconsensusString = f.target.value.toLowerCase();
    }
  }
}
