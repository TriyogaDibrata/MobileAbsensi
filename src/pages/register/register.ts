import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { LoginPage } from '../login/login';

import { Camera, CameraOptions } from '@ionic-native/camera';
//import { HTTP } from '@ionic-native/http';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';

/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {

  base64image : string;
  image: string;
  gallery_name: string;
  subject_id: string;

  userData = {nama:''};

  constructor(public navCtrl: NavController, 
              public navParams: NavParams,
              public http: Http,
              public camera: Camera,
              public alert: AlertController) {
  }

  ToLogin () {
    this.navCtrl.setRoot(LoginPage);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

  takePhoto(){
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 320,
      targetWidth: 320,
      saveToPhotoAlbum: false
    }

    this.camera.getPicture(options).then((imageData)=> {
      this.base64image = 'data:image/jpeg;base64,' + imageData;
    }); 
  }

  register() {

    let subjectd = this.userData.nama;

    //console.log(subjectd);

    //return false;

    let headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'app_id' : 'c6226a76',
        'app_key' : '2a7fb56100a89eaa2839629e73169aad'
      });

      let options = new RequestOptions({headers : headers});

      let data = JSON.stringify({
        image : this.base64image,
        subject_id: subjectd,
        gallery_name : "Test"
      });

      return new Promise((resolve, reject) =>{
        this.http.post('https://api.kairos.com/enroll', data, options)
        .toPromise()
        .then((response) => 
      {
        console.log( 'API Response :', JSON.stringify(response.json().images[0].transaction.status));
        let status = JSON.stringify(response.json().images[0].transaction.status);
        if (status = "success") {
        let success = this.alert.create({
          title: "Message",
          subTitle: "Wajah Berhasil Didaftarkan "+status,
          buttons: ['OK']
        });
        success.present();
        this.navCtrl.setRoot(LoginPage);
      } else {
        let error = this.alert.create({
          title: "Error",
          subTitle: "Tidak Dapat Mendaftarkan Wajah",
          buttons: ["OK"]
        });
        error.present();
      }
      })
      .catch((error) => 
    {
      console.error('API Error :', error.status);
      console.error('API Error:', JSON.stringify(error));
      let Error = this.alert.create({
        title: "Error",
        subTitle: JSON.stringify(error),
        buttons: ['OK']
      });
      Error.present();
    });
    });

  }

}
