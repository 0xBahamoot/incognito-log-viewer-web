import { BackendService } from './../backend.service';
import { Component, OnInit } from '@angular/core';
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  // tslint:disable-next-line:max-line-length
  chains = [{ title: 'Beacon', chainID: -1 }, { title: 'Shard0', chainID: 0 }, { title: 'Shard1', chainID: 1 }, { title: 'Shard2', chainID: 2 }, { title: 'Shard3', chainID: 3 }, { title: 'Shard4', chainID: 4 }, { title: 'Shard5', chainID: 5 }, { title: 'Shard6', chainID: 6 }, { title: 'Shard7', chainID: 7 }];
  nodes = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22];
  nodeStatuses = new Map([]);
  nodePhase = new Map([]);
  constructor(private backend: BackendService) {
    backend.connectToLogStatus();
    setTimeout(() => {
      console.log('svb');
      backend.logStatusStream.subscribe(status => {
        this.nodePhase.set((status.Chain + (status.Node).toString()), status.ProducingStatus.Phase);
        this.nodeStatuses.set((status.Chain + (status.Node).toString()), status);
      });
    }, 4000);

  }

  ngOnInit(): void {
  }

  // getStatus(node: number, chain: string): string {
  //   const key = chain.toLowerCase()+ node.toString();
  //  const r = this.nodeStatuses.get(key)
  // }
}
