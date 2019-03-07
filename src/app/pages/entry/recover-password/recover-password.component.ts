import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';
import { FormGroup , Validators, FormBuilder} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-recover-password',
  templateUrl: './recover-password.component.html',
  styleUrls: ['./recover-password.component.css']
})
export class RecoverPasswordComponent implements OnInit {

  form: FormGroup;

  constructor(private auth: AuthService, private router: Router, private fb: FormBuilder,  private toast: ToastrService) { }

  ngOnInit() {
    if(localStorage.getItem('aid'))
    {
      this.router.navigate(['/dashboard/home']);
    }
    
    this.form = this.fb.group({
      email: ['', Validators.compose([
        Validators.required,
        Validators.minLength(3),
        Validators.email
      ])]
    });
  }

  get f() { return this.form.controls; }

  sendRecoverEmail(email){
    this.auth.forgotPassword(email)
      .then(data =>{
          this.toast.success('Email Sent! Check your inbox.', 'Forogt Password');
      }, err =>{
        this.toast.error(err.message, 'Error sending Email!');
      });
  }

}
