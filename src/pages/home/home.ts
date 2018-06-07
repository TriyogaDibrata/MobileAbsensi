import { Component, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import { NavController, 
         ModalController, 
         ViewController, 
         AlertController, 
         Platform,
         ToastController,
         LoadingController } from 'ionic-angular';

import { ModalhomePage } from '../modalhome/modalhome';

import {  GoogleMaps, 
          GoogleMap, 
          CameraPosition,  
          Marker,
          MarkerOptions, 
          ILatLng,
          Circle,
          Spherical} from '@ionic-native/google-maps';
import { Geolocation } from '@ionic-native/geolocation';

import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http, Headers, RequestOptions } from '@angular/http';
import { Keyboard } from "@ionic-native/keyboard";
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/toPromise';
import 'rxjs/add/operator/filter';
import { Subscription } from 'rxjs/Subscription';
import { disableDebugTools } from '@angular/platform-browser';

//declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  @ViewChild('map') mapElement: ElementRef;
  map: GoogleMap;

  base64image: string;

  image : string;

  gallery_name : string;

  center: ILatLng;

  loc: ILatLng;

  space: number;

  attBtn : boolean = false;

  locstatus: any;

  public isToggled : boolean = false;

  curr_lat : any;

  curr_lng : any;

  subscription : Subscription;

  hideThis : boolean = true;
  hideMe : boolean= false;

  // showToolbar:boolean = false;
  
  // successCallback: any;

  // errorCallback: any;

  constructor(private navCtrl: NavController,
              private _geoloc: Geolocation,
              public modalctrl: ModalController,
              private viewCtrl: ViewController,
              private camera: Camera,
              private http: Http,
              private alert: AlertController,
              private platform : Platform,
              private toast: ToastController,
              private keyboard: Keyboard,
              private loading: LoadingController,
              private ref: ChangeDetectorRef) {
    
  }

  ionViewDidLoad() {

    let load_map = this.loading.create({
      content: "Memuat Peta. . .",
      duration: 3000,
    });

    this.initMap();
    this.drawRadius();

    this.subscription = this.getlocation()
    .filter((p) => p.coords !== undefined) //Filter Out Errors
    .subscribe(position => {
      load_map.present();

      this.curr_lat = position.coords.latitude;
      this.curr_lng = position.coords.longitude;
      this.loc = {'lat': this.curr_lat, 'lng':this.curr_lng};

      this.animateCamera();

      this.space = Spherical.computeDistanceBetween(this.loc, this.center)/1000;

      if (this.space > 0.05){
        this.attBtn=false;
        this.hideMe=false;
      } else if (this.space < 0.05) {
        this.attBtn=true;
        this.hideMe=true;
      }
  
  
      if (this.space > 0.05) {
        this.locstatus = "Anda Berada : " +this.space.toFixed(2)+ " Kilometer Dari Titik Absen";
      } else if (this.space < 0.05) {
        this.locstatus ="Silahkan Melakukan Absen";
      }

      load_map.dismiss();

    });

  //(<any>window).plugins.mocklocation.check((a) => this.successCallback(a), (b) => this.errorCallback(b)); 

    //subscription.unsubscribe();
  }

  // onScroll($event: any){
  //   let scrollTop = $event.scrollTop;
  //   this.showToolbar = scrollTop >= 120;
  //   this.ref.detectChanges();
  // }

  // successCallback(result) {
  //   this.toast.create({
  //     message: result,
  //     duration: 2000
  //   }).present();
  //   console.log(result); // true - enabled, false - disabled
  // }

  errorCallback(error) {
    this.toast.create({
      message: error,
      duration: 2000
    }).present();
    console.log(error);
  }


  //mendapatkan lokasi realtime pengguna
  getlocation(){
    return this._geoloc.watchPosition({ maximumAge: 3000, timeout: 5000, enableHighAccuracy: true });

  }


  //initialize map
  initMap(){
    let element = this.mapElement.nativeElement;

    this.map = GoogleMaps.create(element, {
      'backgroundColor': 'white',
      'controls': {
        'compass': true,
        'myLocation': true,
        'myLocationButton': true,
        'indoorPicker': true,
        'zoom': true
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      },
      'camera': {
        'target': this.loc,
        'zoom': 17
      }
    });
  }

  animateCamera(){
  this.map.animateCamera({
      target: this.loc,
      zoom: 17,
      tilt: 10,
      bearing: 140,
      duration: 2000
    })
  }

  //membuat radius titik absen
  drawRadius (){
    this.center ={"lat": -8.6033745, "lng": 115.1758826};
    let radius = 50; //radius in meters

    this.map.addCircle({
      'center' : this.center,
      'radius': radius,
      'strokeColor': '#FE2E2E',
      'strokeOpacity': 0.5,
      'strokeWeight': 0.2,
      'fillColor': '#F78181',
      'fillOpacity': 0.35
    })
  }

  AbsenLuar() {

    let confirm = this.alert.create({
          title: 'Anda Mengaktifkan Fitur Absen Luar Kantor',
          message: 'Fitur ini hanya digunkan untuk kepentingan kedinasan luar kantor, di perlukan dokumen pendukung untuk menggunakan fitur ini. Penting bagi pegawai agar tidak menyalahgunakan fitur ini. Lanjutkan ?',
          buttons: [
            {
              text: 'Tidak',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
                this.isToggled = false;
                this.hideThis = true;
              }
            },
            {
              text: 'Lanjut',
              handler: () => {
                console.log('Lanjut clicked');
                this.hideThis = false;
                this.attBtn = true;
              }
            }
          ]
        });

    if (this.isToggled == true) {
      confirm.present();
      this.subscription.unsubscribe();
    } else if (this.isToggled == false) {
      this.attBtn = false;
      this.hideThis = true;
    }
  }

  openCamera() {
    const options: CameraOptions = {
      quality: 100,
      destinationType: this.camera.DestinationType.DATA_URL,
      sourceType: this.camera.PictureSourceType.CAMERA,
      allowEdit: true,
      encodingType: this.camera.EncodingType.JPEG,
      targetHeight: 320,
      targetWidth: 320,
      saveToPhotoAlbum: false,
      cameraDirection: 1 //1 = front camera
    }

    this.camera.getPicture(options).then((imageData)=> {
      this.base64image = 'data:image/jpeg;base64,' + imageData;
      this.absen();
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
          subTitle: "Terimakasih, " +JSON.stringify(response.json().images[0].candidates[0].subject_id)+ "Pada Koordinat :" +this.curr_lat+ "," +this.curr_lng,
          buttons: ['OK']
        });
        success.present();
        this.viewCtrl.dismiss();
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
