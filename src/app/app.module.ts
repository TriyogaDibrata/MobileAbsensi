import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { ProfilePage } from '../pages/profile/profile';
import { AbsensiPage } from '../pages/absensi/absensi';
import { IonSimpleWizard } from '../pages/form-wizard/ion-simple-wizard.component';
import { IonSimpleWizardStep} from '../pages/form-wizard/ion-simple-wizard.step.component';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
//import { HTTP } from '@ionic-native/http';
import { HttpModule } from '@angular/http';
import { Keyboard } from '@ionic-native/keyboard';
import { ModalhomePage } from '../pages/modalhome/modalhome';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DynamicPage } from '../pages/dynamic-steps/dynamic.page';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    AbsensiPage,
    ModalhomePage,
    IonSimpleWizard,
    IonSimpleWizardStep,
    DynamicPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp, {
      scrollAssist: false,
      autoFocusAssist: false
    }),
    HttpModule,
    BrowserAnimationsModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    LoginPage,
    RegisterPage,
    ProfilePage,
    AbsensiPage,
    ModalhomePage,
    IonSimpleWizard,
    IonSimpleWizardStep,
    DynamicPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    GoogleMaps,
    Geolocation,
    Camera,
    //HTTP,
    HttpModule,
    Keyboard,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
