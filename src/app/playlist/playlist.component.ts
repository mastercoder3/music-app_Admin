import { Component, OnInit } from '@angular/core';
import { ApiService } from '../services/api/api.service';
import { map } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.component.html',
  styleUrls: ['./playlist.component.css']
})
export class PlaylistComponent implements OnInit {

  playlist;
  showSpinner = true;
  songs;
  titles;
  constructor(private api: ApiService, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
  }

  getData(){
    this.api.getAllSongs()
    .pipe(map(actions => actions.map(a=>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
    .subscribe(res => {
      this.songs = res;
      this.api.getAllPublicPlaylist()
      .pipe(map(actions => actions.map(a=>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res =>{
        this.showSpinner = false;
        this.playlist =res;

      })
    })

  }

  getTitle(id){
    let x  = this.songs.filter(data => data.did === id);
    return x[0].title;
  }


  delete(item){
    if(confirm('Are you sure you want to delete')){
      this.api.deletePublicPlaylist(item.did)
        .then(res =>{
          this.toastr.success('Playlist Deleted');
        }, err =>{
          this.toastr.error(err.message)
        })
    }
  }

}
