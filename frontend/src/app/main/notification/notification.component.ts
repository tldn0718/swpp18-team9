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
        console.log('allNoti', allNoti);
        let receiver = allNoti.filter((noti) => noti.receiver === parseInt(this.auth.userId));
        return receiver;
      }),
    ).subscribe((myNoti: any[])=>{
      console.log('received notifications: ', myNoti);
      this.notifications = myNoti;
    });
  }

  //this id is notifiaction id
  checkAccept(id: number){
    this.graph.sendAnswer(id, 'accept');
    this.updateNotification();
    this.update.emit();
  }

  checkDecline(id: number){
  	this.graph.sendAnswer(id, 'decline');
    this.updateNotification();
  }
}