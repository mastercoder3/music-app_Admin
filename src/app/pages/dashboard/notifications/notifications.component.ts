import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.css']
})
export class NotificationsComponent implements OnInit {

  showSpinner: boolean = true;
  notifications;
  image: string='./../../assets/app-assets/images/blank.png';
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  imageId;
  data ={ 
    title:'',
    detail: '',
    imageURL: '',
    imageId: ''
  };
  push={
    title: '',
    message: ''
  };
  flag = false;

  constructor(private api: ApiService, private ngxService: NgxUiLoaderService,
    private helper: HelperService, private fireStorage: AngularFireStorage, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getAllNotifications()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
          this.notifications = res;
          this.showSpinner = false;
        });
  }

  addNotification(content){
    this.helper.openModelLg(content);
    this.imageId = Math.floor(Date.now() / 1000);
  }

  upload(event){
    this.flag = true;
    this.ngxService.start();
    this.ref = this.fireStorage.ref('Notifications/'+this.imageId.toString());
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.data.imageURL = url;   
          this.ngxService.stop();       
        });
      })
    ).subscribe();

  }

  submitNotification(){
    if(this.data.detail !== '' && this.data.title !== ''){
      if(this.flag)
         this.data.imageId = this.image;
      this.api.addNotification(this.data)
        .then(res =>{
          this.toastr.success('Notification added.','Operation Successfull.');
          this.helper.closeModel();
        },err =>{
          this.toastr.error(err.message,'Error! while adding notification.');
        });
    }
    else{
      this.toastr.error('Please fill in complete details','Error! while adding notification.');
    }
  }

  delete(item){
    if(confirm(`Are you sure to delete ${item.title}`)){
      this.api.deleteNotification(item.did)
        .then(res =>{
          this.toastr.success('Notification record deleted.','Operation Successfull.');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  sendPushNotification(){
    if(this.push.title !== '' && this.push.message){
      this.api.setPushNotification(this.push)
      .then(res =>{
        this.toastr.success('Push Notification sent.','Operation Successfull.');
        this.helper.closeModel();
      }, err =>{
        this.toastr.error(err.message, 'Error!');
      })
    }
  }

  openPush(content){
    this.helper.openModelLg(content);
  }

}
