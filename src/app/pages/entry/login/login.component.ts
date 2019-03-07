import { Component, OnInit, NgZone } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { ApiService } from 'src/app/services/api/api.service';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  
  form: FormGroup;
  error: boolean=false;
  errMsg;
  user;

  constructor(private router: Router, private fb: FormBuilder, private api: ApiService, private auth: AuthService, private ngZone: NgZone) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])],
      password: ['', Validators.compose([
        Validators.required
      ])]
    });
  }
 
  get f() { return this.form.controls; }

  onSubmit(email, password){
    if(localStorage.getItem('aid')){
        localStorage.removeItem('aid');
      }

      this.auth.login(email,password)
        .then(res =>{
          this.user = res;
          if(this.user){
            localStorage.setItem('aid', res.user.uid);
            this.ngZone.run(() => this.router.navigate(['/dashboard/home'])).then();
          }
        }, err =>{
          this.error =true;
          this.errMsg = err.message;
        })
  }

}
