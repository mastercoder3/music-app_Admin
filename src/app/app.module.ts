//core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';

//services
import { ApiService } from './services/api/api.service';
import { HelperService } from './services/helper/helper.service';
import { AuthService } from './services/auth/auth.service';

//components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/entry/login/login.component';


// Routes path
const routes = [
  {path: '' , redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireAuthModule,
    AngularFirestoreModule,
    AngularFireStorageModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ApiService, AuthService, HelperService],
  bootstrap: [AppComponent]
})
export class AppModule { }
