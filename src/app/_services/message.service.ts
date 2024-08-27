import { Injectable } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from '@angular/fire/compat/database';
import Message from '../models/message.model';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  messageRef!: AngularFireList<Message>;

  constructor(private db: AngularFireDatabase) {
  }

  initMessageService(userId:string) {
    
    if( userId ) {
      this.messageRef = this.db.list("users/" + userId + "/messages");  
    }
  }

  getAll(): AngularFireList<Message> {
    return this.messageRef;
  }

  // create(tutorial: Tutorial): any {
  //   return this.tutorialsRef.push(tutorial);
  // }

  // update(key: string, value: any): Promise<void> {
  //   return this.tutorialsRef.update(key, value);
  // }

  // delete(key: string): Promise<void> {
  //   return this.tutorialsRef.remove(key);
  // }

  // deleteAll(): Promise<void> {
  //   return this.tutorialsRef.remove();
  // }
}