//core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

//packages
import { FilterPipeModule } from 'ngx-filter-pipe';
import {NgxPaginationModule} from 'ngx-pagination';
import { ToastrModule } from 'ngx-toastr';
import {NgbModalModule, NgbModule} from '@ng-bootstrap/ng-bootstrap';


//firebase
import { AngularFireModule } from '@angular/fire';
import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { environment } from '../environments/environment';
import { FirestoreSettingsToken } from '@angular/fire/firestore';

//services
import { ApiService } from './services/api/api.service';
import { HelperService } from './services/helper/helper.service';
import { AuthService } from './services/auth/auth.service';

//components
import { AppComponent } from './app.component';
import { LoginComponent } from './pages/entry/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard/dashboard.component';
import { HomeComponent } from './pages/dashboard/home/home.component';
import { NavbarComponent } from './pages/shared/navbar/navbar.component';
import { SidebarComponent } from './pages/shared/sidebar/sidebar.component';
import { NotificationsComponent } from './pages/dashboard/notifications/notifications.component';
import { SpinnerComponent } from './pages/shared/ui/spinner/spinner.component';
import { SongsComponent } from './pages/dashboard/songs/songs.component';
import { RecoverPasswordComponent } from './pages/entry/recover-password/recover-password.component';


// Routes path
const routes = [
  {path: '' , redirectTo: 'login', pathMatch: 'full'},
  {path: 'login', component: LoginComponent},
  {path: 'recover-password', component: RecoverPasswordComponent},
  {path: 'dashboard', component: DashboardComponent, children: [
    {path: '', redirectTo: 'home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'notifications', component: NotificationsComponent},
    {path: 'songs', component: SongsComponent}
  ]}
]

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    DashboardComponent,
    HomeComponent,
    NavbarComponent,
    SidebarComponent,
    NotificationsComponent,
    SpinnerComponent,
    SongsComponent,
    RecoverPasswordComponent
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
    NgbModalModule,
    NgbModule,
    ToastrModule.forRoot(),
    NgxPaginationModule,
    FilterPipeModule,
    RouterModule.forRoot(routes)
  ],
  providers: [ApiService, AuthService, HelperService, { provide: FirestoreSettingsToken, useValue: {} }],
  bootstrap: [AppComponent]
})
export class AppModule { }
