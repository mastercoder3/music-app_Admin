import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private api: ApiService) { }
  length;
  ngOnInit() {
    this.api.getAllSongs()
      .pipe(map(actions => actions.map(a=>{
        const data = a.payload.doc.id;
        return {data}
      })))
      .subscribe(res =>{
        this.length = res;
        this.length = this.length.length;
      })
  }

}
