import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { AccordionComponent } from 'angularx-accordion';
import {AccordionToggleComponent } from 'angularx-accordion';
import { Accordion } from 'angularx-accordion/accordion';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService) { }
  songs;
  length;
  views = 0;
  users;
  usersLength;
  showSpinner = true;
  recently;

  ngOnInit() {
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a => {
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
      .subscribe(res => {
        this.songs = res;
        this.length = this.songs.length;
        if (this.songs.length > 0) {
          this.songs.forEach(a => {
            this.views += a.views;
          });
        }
        this.api.getAllRecently()
        .pipe(map(actions => actions.map(a => {
          const data = a.payload.doc.data();
          const did = a.payload.doc.id;
          return {did, ...data};
        })))
        .subscribe(ress => {
          this.recently = ress;
          this.showSpinner = false;
          console.log(this.recently)
        });
      });
      

    this.api.getAllUsers()
    .pipe(map(actions => actions.map(a => {
      const data = a.payload.doc.data();
      const did = a.payload.doc.id;
      return {did, ...data};
    })))
    .subscribe(res => {
      this.users = res;
      console.log(this.users)
      this.usersLength = this.users.length;
    });


  }

  getUserName(id) {
    if(!this.users)
      return;

    let x: Array<any>;
    x = this.users.filter(data => data.did === id);
    if(x.length === 0)
      return '';
    if (x[0].name !== '') {
      return x[0].name +'     (' +x[0].email+')';
    }
    else {
      return 'User'
    }
  }

  getSongsName(id) {
    let x: Array<any>;
    x  = this.songs.filter(data => data.did === id);
    if(x.length === 0)
      return '';

    if (x[0].title) {
      return x[0].title;
    }
  }

}
