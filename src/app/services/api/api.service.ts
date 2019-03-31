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
    return this.afs.doc('notifications/push').update(data);
  }

  // Songs

  getAllSongs(){
    return this.afs.collection('songs').snapshotChanges();
  }

  addSong(data){
    return this.afs.collection('songs').add(data);
  }

  deleteSong(id){
    return this.afs.doc('songs/'+id).delete();
  }

  // Get Ads

  addToAds(id,data){
    return this.afs.doc('ads/'+id).set(data);
  }

  getAllAds(){
    return this.afs.collection('ads').snapshotChanges();
  }

  addAds(data){
    return this.afs.collection('ads').add(data);
  }

  deleteAd(id){
    return this.afs.doc('ads/'+id).delete();
  }

  updateAd(id,data){
    return this.afs.doc('ads/'+id).update(data);
  }

  // Get pop-up

  getAllPopup(){
    return this.afs.collection('popup').snapshotChanges();
  }

  addPopup(data){
    return this.afs.collection('popup').add(data);
  }

  updatePopup(id,data){
    return this.afs.doc('popup/'+id).update(data);
  }

  getPopupById(id){
    return this.afs.doc('popup/'+id).valueChanges();
  }

  deletePopup(id){
    return this.afs.doc('popup/'+id).delete();
  }

  // Get featured

  getFeatured(){
    return this.afs.collection('featured').snapshotChanges();
  }

  addFeatured(id,data){
    return this.afs.doc('featured/'+id).set(data);
  }

  deleteFeatured(id){
    return this.afs.doc('featured/'+id).delete();
  }

}
