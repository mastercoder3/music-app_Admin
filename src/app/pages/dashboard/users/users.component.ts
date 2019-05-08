import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api/api.service';
import { HelperService } from 'src/app/services/helper/helper.service';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastrService } from 'ngx-toastr';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {
  showSpinner: boolean = true;
  users;
  pData;
  image: string='./../../assets/app-assets/images/blank.png';
  userFilter = {
    username: ''

  };


// tslint:disable-next-line: max-line-length
  constructor(private api: ApiService, private helper: HelperService, private fireStorage: AngularFireStorage, private toastr: ToastrService) { }

  ngOnInit() {
    this.getData();
  }
  getData(){
    this.api.getAllUsers()
      .pipe(map(actions => actions.map(a =>{
        const data = a.payload.doc.data();
        const did = a.payload.doc.id;
        return {did, ...data};
      })))
        .subscribe(res =>{
            this.users = res;
            console.log(this.users)
            this.showSpinner = false;
        })

  }


  delete(item){
    if(confirm(`Are you sure to delete ${item.title}`)){
      this.api.deleteUser(item.did)
        .then(res =>{
          this.toastr.success('User deleted.','Operation Successfull.');
        }, err =>{
          this.toastr.error(err.message, 'Error!');
        })
    }
  }

  inactive(item,val){
    item.isVerified = val;
    let id = item.did;
    delete item['did']
    this.api.updateUser(id, item);
  }

}
