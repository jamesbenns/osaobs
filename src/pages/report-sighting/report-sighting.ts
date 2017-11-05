import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { FirebaseProvider } from '../../providers/firebase/firebase';

/**
 * Generated class for the ReportSightingPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-report-sighting',
  templateUrl: 'report-sighting.html',
})
export class ReportSightingPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public alertCtrl: AlertController, private geolocation: Geolocation, private http: Http, private camera: Camera, public loadingCtrl: LoadingController, public firebase: FirebaseProvider) {
  }

  options: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: undefined
  }

  sightingData = {
    species: "Test Sighting",
    lat: "",
    lng: "",
    img: "",
    date: "",
    location: ""
  }

  picture:string = "./assets/img/placeholder.png";  

  loading;

  send(){
    this.createLoading();
    this.sightingData.date = Date();
    this.firebase.addSighting(this.sightingData).then(success => {
      this.loading.dismiss();
      this.navCtrl.popToRoot(); 
    }, error => {
      console.log(error);
      this.loading.dismiss();
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "We couldn't save your data",
        buttons: ['OK']
      });
      alert.present();
    })
  }

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: 'Loading...'
    });
    this.loading.present();    
  }

  getAddress(){
  
    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ decodeURI(this.sightingData.lat.replace(/\s/g, '')) +","+ decodeURI(this.sightingData.lng.replace(/\s/g, '')) +"&key=AIzaSyC8LqnQR4-HhO4haik-QEAt79QFosXnEbA&result_type=locality|political|administrative_area_level_2|administrative_area_level_1";
    this.http.get(url).subscribe(data => {
      this.loading.dismiss();  
      if(data.json().results.length){
        this.sightingData.location = data.json().results[0].address_components[0].long_name;        
      } else this.sightingData.location = "Point on map";
    },
    err => {
      this.loading.dismiss();            
      let alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: "We couldn't find your location",
        buttons: ['OK']
      });
      alert.present();
    }
    );
  }

  chooseLocation(){
    let alert = this.alertCtrl.create();
    alert.setTitle('Select location');

    alert.addInput({
      type: 'radio',
      label: 'Use my location',
      value: 'gps',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: 'Enter lat/lng',
      value: 'latlon'
    });

    alert.addButton('Cancel');
    alert.addButton({
      text: 'OK',
      handler: data => {
        if(data == 'gps'){
          this.createLoading();          
          this.geolocation.getCurrentPosition().then((resp) => {
            this.sightingData.lat = resp.coords.latitude.toString();
            this.sightingData.lng = resp.coords.longitude.toString();
            this.getAddress();
          }).catch((error) => {
            this.loading.dismiss();
            let alert = this.alertCtrl.create({
              title: 'Error',
              subTitle: "We couldn't find your location",
              buttons: ['OK']
            });
            alert.present();
          });
        } else this.enterLatlng();
      }
    });
    alert.present();
  }

  enterLatlng(){
    let prompt = this.alertCtrl.create({
      title: 'Enter lat/lng',
      inputs: [
        {
          name: 'Lat',
          placeholder: 'Lat eg. "9.9356124"',
          type: 'tel'
        },
        {
          name: 'Lng',
          placeholder: 'Lng eg. "-84.1483647"',
          type: 'tel'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            this.sightingData.lat = "";
            this.sightingData.lng = ""
          }
        },
        {
          text: 'Go',
          handler: data => {
            this.createLoading();            
            this.sightingData.lat = data.Lat;
            this.sightingData.lng = data.Lng;
            this.getAddress();           
          }
        }
      ]
    });
    prompt.present();
  }

  getPic(){
  
      let confirm = this.alertCtrl.create({
        title: 'Get picture from camera or gallery?',
        buttons: [
          {
            text: 'Gallery',
            handler: () => {
              this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
              this.takePic()
            }
          },
          {
            text: 'Camera',
            handler: () => {
              this.options.sourceType = this.camera.PictureSourceType.CAMERA;
              this.takePic()
            }
          }
        ]
      });
      confirm.present();
  
    }
  
    takePic(){
      this.camera.getPicture(this.options).then((imageData) => {
        this.picture = 'data:image/jpeg;base64,'+imageData;
        this.sightingData.img = 'data:image/jpeg;base64,'+imageData;        
        }, (err) => {
          console.log(err);
        });
    }


}
