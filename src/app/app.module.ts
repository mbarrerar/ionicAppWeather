import {BrowserModule} from '@angular/platform-browser';
import {ErrorHandler, NgModule} from '@angular/core';
import {IonicApp, IonicErrorHandler, IonicModule} from 'ionic-angular';
import {SplashScreen} from '@ionic-native/splash-screen';
import {StatusBar} from '@ionic-native/status-bar';
import {MyApp} from './app.component';
import {AuthService} from "../providers/auth-service/auth-service";
import {DataService} from '../providers/data-service/data-service';
import {UserServiceProvider} from '../providers/user-service/user-service';
import {Http, HttpModule} from "@angular/http";
import {RegistrationServiceProvider} from "../providers/registration-service/registration-service";
import {AuthConfig, AuthHttp} from "angular2-jwt";
import {TOKEN_NAME} from "../providers/authentication-service/auth.constant";
import {AuthenticationService} from "../providers/authentication-service/authentication-service";
import {ChartsModule} from "ng2-charts";
import {LoginPageModule} from "../pages/login/login.module";
import {Geolocation} from "@ionic-native/geolocation";
import {Push} from "@ionic-native/push";
import {PhonegapLocalNotification} from "@ionic-native/phonegap-local-notification";

export function authHttpServiceFactory(http: Http) {
  return new AuthHttp(new AuthConfig({
    headerPrefix: 'Bearer',
    tokenName: TOKEN_NAME,
    globalHeaders: [{'Content-Type': 'application/json'}],
    noJwtError: false,
    noTokenScheme: true,
    tokenGetter: (() => localStorage.getItem(TOKEN_NAME))
  }), http);
}
@NgModule({
  declarations: [
    MyApp

  ],
  imports: [
    LoginPageModule,
    HttpModule,
    BrowserModule,
    ChartsModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,



  ],
  providers: [
    AuthService,
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    {provide: AuthHttp, useFactory: authHttpServiceFactory, deps: [Http]},
    DataService,
    AuthenticationService,
    RegistrationServiceProvider,
    UserServiceProvider,
    Geolocation,
    Push,
    PhonegapLocalNotification
  ]
})
export class AppModule {}
