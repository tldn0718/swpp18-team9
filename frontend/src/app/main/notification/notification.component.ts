import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { GraphService } from '../graph';
import { AuthService  } from '../../auth';
import { tap, map, pluck, filter } from 'rxjs/operators';
import { User, Friend } from 'src/models';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.component.html',
  styleUrls: ['./notification.component.css']
})
export class NotificationComponent implements OnInit {
  
  @Output() update: EventEmitter<void> = new EventEmitter();

  notifications: any[];

  constructor(private graph: GraphService, private auth: AuthService) { }

  ngOnInit() {
  	this.updateNotification();
  }

  updateNotification() {
  	this.graph.getNotifications().pipe(
      map((allNoti: any[])=>{
        let receiver = allNoti.filter((noti) => noti.receiver === parseInt(this.auth.userId));
        return receiver;
      }),
    ).subscribe((myNoti: any[])=>{
      this.notifications = myNoti;
    });
  }

  //this id is notifiaction id
  checkAccept(id: number){
    this.graph.sendAnswer(id, 'accept').subscribe((res)=>{
      if(this.graph.displayMode == 'all') this.graph.makeAllNetwork().subscribe();
      else if(this.graph.displayMode == 'level') this.graph.makeLevelNetwork(this.graph.level).subscribe();
      this.updateNotification();
    });
  }

  checkDecline(id: number){
  	this.graph.sendAnswer(id, 'decline').subscribe((res)=>{
      this.updateNotification();
    });
  }
}