import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { map } from 'rxjs/operators';
import { HelperService } from 'src/app/services/helper/helper.service';
import { ToastrService } from 'ngx-toastr';

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
  data;
  viewSong;

  constructor(private api: ApiService, private helper: HelperService, private toastr: ToastrService) { }

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
    

  }

  view(conent, item){
    this.helper.openModelLg(conent);
    this.data = item;
    this.viewSong = true;
  }

  delete(item){
    if(confirm(`Are you sure to delete ${item.title}`)){
      this.api.deleteFeatured(item.did)
        .then(res =>{
          this.toastr.success('Song record deleted.','Operation Successfull.');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }



}
