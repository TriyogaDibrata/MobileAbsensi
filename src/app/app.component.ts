import { Component, ViewChild } from '@angular/core';
import { Nav, Platform, AlertController } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { HomePage } from '../pages/home/home';
import { ProfilePage} from '../pages/profile/profile';
import { AbsensiPage } from '../pages/absensi/absensi';
import { LoginPage } from '../pages/login/login';

@Component({
  templateUrl: 'app.html',
  selector: 'page-app'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  rootPage: any = LoginPage;

  pages: Array<{title: string, component: any, icon: string}>;

  constructor(public platform: Platform, 
              public statusBar: StatusBar, 
              public splashScreen: SplashScreen,
              public alert: AlertController) {
    this.initializeApp();

    

    // used for an example of ngFor and navigation
    this.pages = [
      { title: 'Home', component: HomePage, icon: "ios-home-outline" },
      { title: 'Laporan Absensi', component: AbsensiPage, icon: "ios-document-outline"},
      { title: 'Profile', component: ProfilePage, icon: "ios-contact-outline" }
    ];

  }

  initializeApp() {
    this.platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      //this.statusBar.hide();
      this.splashScreen.hide();
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot(page.component);
  }

  logout() {
    let alert = this.alert.create({
      title: 'Confirm Logout',
      message: 'Are you sure to logout ?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Sure',
          handler: () => {
            this.nav.setRoot(LoginPage);
            console.log('Sure clicked');
          }
        }
      ]
    });
    alert.present();
  }

}
