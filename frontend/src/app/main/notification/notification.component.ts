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
  notifications : number[];
  displayNoti : string[];

  constructor(private graph: GraphService, private auth: AuthService) { }

  ngOnInit() {
  	this.updateNotification();
  }

  updateNotification() {
  	this.graph.getNotifications().pipe(
      map((notifications: any[])=>{
        let receiver = notifications.map((noti)=>noti.receiver);
        return receiver;
      }),
    ).subscribe((pending: any[])=>{
      this.notifications = pending.filter(id => id === parseInt(this.auth.userId));
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