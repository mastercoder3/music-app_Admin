import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { TagInputModule } from 'ngx-chips';
import { AngularFireStorage,  AngularFireStorageReference, AngularFireUploadTask } from '@angular/fire/storage';
import { finalize } from 'rxjs/operators'
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { NgxUiLoaderService } from 'ngx-ui-loader';

@Component({
  selector: 'app-pop-up',
  templateUrl: './pop-up.component.html',
  styleUrls: ['./pop-up.component.css']
})
export class PopUpComponent implements OnInit {

  showSpinner = true;
  popup;
  image: string='./../../assets/app-assets/images/blank.png';
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  flag= false;
  imageId;
  data={
    imageURL: '',
    imageId: '',
    title: ''
  };

  startPopup;

  constructor(private api: ApiService, private helper: HelperService, private fireStorage: AngularFireStorage,
    private ngxService: NgxUiLoaderService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
    TagInputModule.withDefaults({
      tagInput: {
          placeholder: 'Atrist Name',
          // add here other default values for tag-input
      }
  });
  }

  getData(){
    this.api.getAllPopup()
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
          this.popup = res;
          this.popup = this.popup.filter(data => data.did !== 'popup');
          this.showSpinner = false;
      })

      this.api.getPopupById('popup')
        .subscribe(res => {
          this.startPopup  =res;
        })
  }

  openPopupSong(content){
    this.helper.openModelLg(content);
    this.imageId = Math.floor(Date.now() / 1000);
  }

  upload(event){
    this.flag = true;
    this.ngxService.start();
    this.ref = this.fireStorage.ref('Popup/'+this.imageId.toString());
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

  upload2(event){
    this.ngxService.start();
    this.ref = this.fireStorage.ref('Popup/statup');
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          this.startPopup.imageURL = url; 
          this.ngxService.stop();        
        });
      })
    ).subscribe();

  }

  submit(){
    if(this.data.imageURL !== '' && this.data.title){   
      this.api.addPopup(this.data)
        .then(res =>{
          this.toastr.success('Pop-up Added to Database.', 'Operation completed.');
          this.helper.closeModel();
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
    else{
      this.toastr.error('Please Fill Important Fields.', 'Cannot Add song.');
    }
  }


  delete(item){
    if(confirm(`Are you sure to delete ${item.title}`)){
      this.api.deletePopup(item.did)
        .then(res =>{
          this.toastr.success('Popup record deleted.','Operation Successfull.');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  openStart(content){
    this.helper.openModelLg(content);
  }

  submitStart(){
    if(this.startPopup){
      this.api.updatePopup('popup',this.startPopup)
        .then(res =>{
          this.toastr.success('Pop-up Added to Database.', 'Operation completed.');
          this.helper.closeModel();
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

}
