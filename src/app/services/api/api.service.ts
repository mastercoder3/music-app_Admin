import { Injectable } from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private afs: AngularFirestore) { }

  updateMaster(uid,data){
    return this.afs.doc('root/'+uid).set(data);
  }

  getMasterAdminProfile(email,password){
    return this.afs.collection('root', ref => ref.where('email','==',email).where('password','==',password)).snapshotChanges();
  }


  // Notification

  getAllNotifications(){
    return this.afs.collection('notifications').snapshotChanges();
  }

  addNotification(data){
    return this.afs.collection('notifications').add(data);
  }

  deleteNotification(id){
    return this.afs.doc('notifications/'+id).delete();
  }

  setPushNotification(data){
    return this.afs.doc('notifications/push').set(data);
  }


}
