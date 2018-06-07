import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, AlertController } from 'ionic-angular';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import { HomePage } from '../home/home';

/**
 * Generated class for the ModalhomePage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modalhome',
  templateUrl: 'modalhome.html',
})
export class ModalhomePage {

  base64image: string;

  image : string;
  gallery_name : string;

  constructor(public navCtrl: NavController, 
              public navParams: NavParams, 
              public viewCtrl: ViewController,
              public camera: Camera,
              public http: Http,
              public alert: AlertController) {
  }

  closeModal(){
    this.viewCtrl.dismiss();
    //this.navCtrl.setRoot(HomePage);
  }

  ionViewDidLoad() {
    //console.log('ionViewDidLoad ModalhomePage');
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 320,
      targetWidth: 320,
      saveToPhotoAlbum: false,
      cameraDirection: 1
    }

    this.camera.getPicture(options).then((imageData)=> {
      this.base64image = 'data:image/jpeg;base64,' + imageData;
      //this.absen();
    }); 

    
    
  }

  absen() {
    let headers = new Headers(
      {
        'Content-Type' : 'application/json',
        'app_id' : 'c6226a76',
        'app_key' : '2a7fb56100a89eaa2839629e73169aad'
      });
      let options = new RequestOptions({headers : headers});

      let data = JSON.stringify({
        image : this.base64image,
        gallery_name : "Test"
      });

      return new Promise((resolve, reject) =>{
        this.http.post('https://api.kairos.com/recognize', data, options)
        .toPromise()
        .then((response) => 
      {
        //console.log( 'API Response :', JSON.stringify(response.json().images[0].candidates[0].subject_id));
        //let subject = JSON.stringify(response.json().images[0].candidates[0].subject_id);
        if (JSON.stringify(response.json()).indexOf("success") > -1 ) {
        resolve(response.json());
        let success = this.alert.create({
          title: "Message",
          subTitle: JSON.stringify(response.json().images[0].candidates[0].subject_id),
          buttons: ['OK']
        });
        success.present();
        this.viewCtrl.dismiss();
        //this.navCtrl.setRoot(HomePage);
      } else {
        let error = this.alert.create({
          title: "Error",
          subTitle: "No User Indentified",
          buttons: ['OK']
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
        subTitle: "No User Identified",
        buttons: ['OK']
      });
      Error.present();
    });
    });

  }
  

}
