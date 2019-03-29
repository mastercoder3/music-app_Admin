import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';

@Component({
  selector: 'app-featured',
  templateUrl: './featured.component.html',
  styleUrls: ['./featured.component.css']
})
export class FeaturedComponent implements OnInit {
  
  showSpinner = false;
  songFilter = {
    title: ''
  };
  featured;
  songs;

  constructor(private api: ApiService, private helper: HelperService) { }

  ngOnInit() {
    this.showSpinner = true;
    this.getData();
  }

  getData(){
    this.api.getFeatured()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data}
      })))
      .subscribe( res => {
        this.featured = res;
        this.showSpinner = false;
      });
    
    this.api.getAllSongs()
    .pipe(map(actions => actions.map(a =>{
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data}
    })))
    .subscribe( res => {
      this.songs = res;
    });
  }

  openAddSong(content){
    this.helper.openModelLg(content);
  }

}
