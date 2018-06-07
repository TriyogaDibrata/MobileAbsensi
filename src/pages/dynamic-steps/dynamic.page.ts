import { Component } from '@angular/core';
import { NavController, AlertController, Events } from 'ionic-angular';
import { LoginPage } from '../login/login';

@Component({
    selector: 'page-dynamic',
    templateUrl: 'dynamic.page.html',

})
export class DynamicPage {
    step: any;
    stepCondition: any;
    stepDefaultCondition: any;
    currentStep: any;
    stepsArray: Array<Object> = [];
    constructor(public navCtrl: NavController, public alertCtrl: AlertController, public evts: Events) {
        /**
         * Step Wizard Settings
         */
        this.step = 1;//The value of the first step, always 1
        this.stepCondition = false;//For each step the condition is set to this value, Set to true if you don't need condition in every step
        this.stepDefaultCondition = this.stepCondition;//Save the default condition for each step
        //Let's create some dummy data for this case
        this.stepsArray =
            [
                {
                    title: 'Langkah 1 (Pengecekan Nomor Induk Pegawai)',
                    content: 'Masukan NIP anda'
                },
                {
                    title: 'Langkah 2 (Proses Verifikasi)',
                    content: 'Masukan tanggal lahir anda'
                },
                {
                    title: 'Langkah 3 (Proses Registrasi)',
                    content: 'Masukan Nomor Hp dan Password Baru Anda'
                },
                {
                    title: 'Langkah 4 (Proses Perekaman Wajah)',
                    content: 'Daftarkan Wajah Anda'
                }
            ];
        //You can subscribe to the Event 'step:changed' to handle the current step
        this.evts.subscribe('step:changed', step => {
            //Handle the current step if you need
            this.currentStep = step;
            //Set the step condition to the default value
            this.stepCondition = this.stepDefaultCondition;
        });
        this.evts.subscribe('step:next', () => {
            //Do something if next
            console.log('Next pressed: ', this.currentStep);
        });
        this.evts.subscribe('step:back', () => {
            //Do something if back
            console.log('Back pressed: ', this.currentStep);
        });
    }
    /**
     * Demo functions
     */
    onFinish() {
        this.alertCtrl.create({
            message: 'Proses Registrasi dan Rekam Wajah Berhasil. Silahkan Login Menggunakan NIP dan Password yang Telah Terdaftar',
            title: 'Selamat',
            buttons: [{
                text: 'Ok'
            }]
        }).present();
        this.navCtrl.push(LoginPage);
    }

    toggleCondition(_condition) {
        this.stepCondition = _condition.checked;
    }

}
