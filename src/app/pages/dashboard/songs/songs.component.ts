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
  selector: 'app-songs',
  templateUrl: './songs.component.html',
  styleUrls: ['./songs.component.css']
})
export class SongsComponent implements OnInit {

  showSpinner: boolean = true;
  songs;
  image: string='./../../assets/app-assets/images/blank.png';
  songFilter={
    title: ''
  }
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
    mood: 'happy',
    views: 0,
    upload: new Date(),
    uid: ''
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
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
            this.songs = res;
            this.showSpinner = false;
        })
  }

  openAddSong(content){
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
      if(this.data.video !== '')
        this.data.video = this.data.video + '?controls=0&amp;modestbranding=1&amp;rel=0&amp;showinfo=0&amp;loop=0&amp;fs=0&amp;hl=en&amp;enablejsapi=1&amp;widgetid=1';
      this.data.imageId = this.imageId;
      this.data.songId = this.songId;
        this.api.addSong(this.data)
        .then(res =>{
          this.toastr.success('Song Added to Database.', 'Operation completed.');
          this.helper.closeModel();
          this.data ={
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
            mood: 'happy',
            views: 0,
            upload: new Date(),
            uid: ''
          };
          
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
      this.api.deleteSong(item.did)
        .then(res =>{
          this.toastr.success('Song record deleted.','Operation Successfull.');
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

  featured(item){
    let id = item.did;
    delete item['did'];

      this.api.addFeatured(id,item)
      .then(res =>{
        this.toastr.success('Song Added to Featured.','Operation Successfull.');
      }, err =>{
        this.toastr.error(err.message, 'Error!');
      })
  }

  addToAds(item){
    let id = item.did;
    delete item['did'];
    item.views = 0;
    item.status = 'active';
    this.api.addToAds(id,item)
    .then(res =>{
      this.toastr.success('Song Added to Ads.','Operation Successfull.');
    }, err =>{
      this.toastr.error(err.message, 'Error!');
    })
  }


}
