import { Component, OnInit } from '@angular/core';
import { TerminalService } from 'primeng/terminal';

@Component({
  selector: 'app-log-viewer',
  templateUrl: './log-viewer.component.html',
  styleUrls: ['./log-viewer.component.scss'],
  providers: [TerminalService],
})
export class LogViewerComponent implements OnInit {

  constructor(private terminalService: TerminalService) { 
    setInterval(()=>{
      this.terminalService.sendCommand("abc");
      //
    },1000)
    this.terminalService.commandHandler.subscribe(command => {
       this.terminalService.sendResponse("abc");
  });
  }

  ngOnInit(): void {
  }

}
