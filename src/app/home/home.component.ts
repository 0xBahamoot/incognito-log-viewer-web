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
  diskLeft = 0;
  constructor(private backend: BackendService) {
    backend.getHostDiskLeft().subscribe(response => {
      this.diskLeft = Number(response.Diskleft);
    });
    backend.connectToLogStatus();
    setTimeout(() => {
      backend.logStatusStream.subscribe(status => {
        if (status.IsSuspectDown) {
          this.nodePhase.set((status.Chain + (status.Node).toString()), 'DOWN');
        } else {
          this.nodePhase.set((status.Chain + (status.Node).toString()), status.ProducingStatus.Phase);
        }
        this.nodeStatuses.set((status.Chain + (status.Node).toString()), status);
      });
    }, 1000);
  }

  ngOnInit(): void {
  }

  // getStatus(node: number, chain: string): string {
  //   const key = chain.toLowerCase()+ node.toString();
  //  const r = this.nodeStatuses.get(key)
  // }

  getBGColor(key: string): string {
    switch (key) {
      case 'PROPOSE':
        return '#ffc409';
      case 'LISTEN':
        return '#ffc409';
      case 'VOTING':
        return '#3880ff';
      case 'COMMIT':
        return '#2dd36f';
      case 'DOWN':
        return '#eb445a';
      default:
        return 'unset';
    }
  }

  getVoteCount(key: string): number {
    let result: any;
    result = this.nodeStatuses.get(key);
    if (!!result) {
      return result.ProducingStatus.VoteCount;
    }
    return 0;
  }

  getIsBlockReceived(key: string): boolean {
    let result: any;
    result = this.nodeStatuses.get(key);
    if (!!result) {
      return result.ProducingStatus.IsBlockReceived;
    }
    return false;
  }

  getIsVoteSent(key: string): boolean {
    let result: any;
    result = this.nodeStatuses.get(key);
    if (!!result) {
      return result.ProducingStatus.IsVoteSent;
    }
    return false;
  }
  getBlockHeight(key: string): number {
    let result: any;
    result = this.nodeStatuses.get(key);
    if (!!result) {
      return result.ProducingStatus.BlockHeight;
    }
    return 0;
  }
  getRound(key: string): number {
    let result: any;
    result = this.nodeStatuses.get(key);
    if (!!result) {
      return result.ProducingStatus.Round;
    }
    return 0;
  }
  getErrorsCount(key: string):number{
    let result:any;
    result = this.nodeStatuses.get(key);
    if (!!result) {
      return result.ErrorsCount;
    }
    return 0;
  }
}
