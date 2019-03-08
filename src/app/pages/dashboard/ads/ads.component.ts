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
  selector: 'app-ads',
  templateUrl: './ads.component.html',
  styleUrls: ['./ads.component.css']
})
export class AdsComponent implements OnInit {

  showSpinner = true;
  ads;
  image: string='./../../assets/app-assets/images/blank.png';

  data ={
    title: '',
    oartist: '',
    artist: [],
    movie: '',
    album: '',
    video: '',
    imageURL: '',
    songURL: '',
    imageId: '',
    songId: '',
    status: 'active'
  };
  uploadProgress: Observable<number>;
  downloadURL: Observable<any>;
  ref: AngularFireStorageReference;
  task: AngularFireUploadTask;
  flag= false;
  imageId;
  songId;
  viewSong = false;

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
    this.api.getAllAds()
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
      .subscribe(res =>{
          this.ads = res;
          this.showSpinner = false;
      })
  }

  openAdSong(content){
    this.helper.openModelLg(content);
    this.imageId = Math.floor(Date.now() / 1000);
    this.songId = Math.floor(Date.now() / 1000);
    this.viewSong = false;
  }

  upload(event,val){
    this.flag = true;
    this.ngxService.start();
    if(val === 'audio')
       this.ref = this.fireStorage.ref('Songs/'+this.songId.toString());
    else
      this.ref = this.fireStorage.ref('Thumbnails/'+this.imageId.toString());
    this.task = this.ref.put(event.target.files[0]);
    this.uploadProgress = this.task.percentageChanges();
    this.task.snapshotChanges().pipe(
      finalize(() => {
        this.ref.getDownloadURL().subscribe(url => {
          if(val !== 'audio')
            this.data.imageURL = url;    
          else
           this.data.songURL = url;    
           this.ngxService.stop();    
        });
      })
    ).subscribe();

  }

  submit(){
    if(this.data.songURL !== '' && this.data.title && this.data.imageURL !== '' && this.data.artist.length !== 0){   
      this.api.addAds(this.data)
        .then(res =>{
          this.toastr.success('Song Added to Database.', 'Operation completed.');
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
      this.api.deleteAd(item.did)
        .then(res =>{
          this.toastr.success('Ad record deleted.','Operation Successfull.');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  view(conent, item){
    this.helper.openModelLg(conent);
    this.data = item;
    this.viewSong = true;
  }

  changeStatus(item, val){
    this.data.status = val;
    let id = item.did;
    delete item['did'];
    this.api.updateAd(id,item)
    .then(res =>{
      this.toastr.success('Ad Status Updated.','Operation Successfull.');
    }, err =>{
      this.toastr.error(err.message, 'Error!');
    })
  }

}
