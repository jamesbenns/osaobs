import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ModalController } from 'ionic-angular';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera, CameraOptions } from '@ionic-native/camera';
import { Http } from '@angular/http';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SpeciesModalPage } from '../species-modal/species-modal';
import { LocationPickerPage } from '../location-picker/location-picker';
import { LanguageProvider } from '../../providers/language/language';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-report-sighting',
  templateUrl: 'report-sighting.html',
})
export class ReportSightingPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public alertCtrl: AlertController,
    private geolocation: Geolocation,
    private http: Http,
    private camera: Camera,
    public loadingCtrl: LoadingController,
    public firebase: FirebaseProvider,
    public modalCtrl: ModalController,
    private userService: UserProvider,
    public language: LanguageProvider
  ) {}

  today = new Date().toISOString();

  options: CameraOptions = {
    quality: 20,
    destinationType: this.camera.DestinationType.DATA_URL,
    encodingType: this.camera.EncodingType.JPEG,
    mediaType: this.camera.MediaType.PICTURE,
    sourceType: undefined
  }

  sightingData = {
    species: "",
    lat: "",
    lng: "",
    img: "",
    date: new Date().toISOString(),
    location: "",
    spanishSpecies: "",
    uid: this.userService.user.uid
  }

  picture:string = "./assets/img/placeholder.png";  

  loading;

  selectSpecies(){
    let modal = this.modalCtrl.create(SpeciesModalPage);
    modal.onDidDismiss(data => {
      if(data) {
        this.sightingData.species = data.name;
        this.sightingData.spanishSpecies = data.spanishName;
      }
      else {
        this.sightingData.species = "";
        this.sightingData.spanishSpecies = "";
      }
    });
    modal.present();
  }

  send(){
    this.createLoading();
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
      content: this.language.english ? 'Loading...' : 'Cargando...'
    });
    this.loading.present();    
  }

  getAddress(){
  
    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ decodeURI(this.sightingData.lat.replace(/\s/g, '')) +","+ decodeURI(this.sightingData.lng.replace(/\s/g, '')) +"&key=AIzaSyC8LqnQR4-HhO4haik-QEAt79QFosXnEbA&result_type=locality|political|administrative_area_level_2|administrative_area_level_1";
    this.http.get(url).subscribe(data => {
      this.loading.dismiss();  
      if(data.json().results.length){
        this.sightingData.location = data.json().results[0].address_components[0].long_name;        
      } else this.sightingData.location = "";
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
    alert.setTitle(this.language.english ? 'Select location' : 'Seleccionar ubicación');

    alert.addInput({
      type: 'radio',
      label: this.language.english ? 'Use my location' : 'Usa mi ubicación',
      value: 'gps',
      checked: true
    });

    alert.addInput({
      type: 'radio',
      label: this.language.english ? 'Choose on map' : 'Elige en el mapa',
      value: 'map'
    });

    alert.addInput({
      type: 'radio',
      label: this.language.english ? 'Enter lat/lng' : 'Ingresar coordenadas',
      value: 'latlon'
    });

    alert.addButton(this.language.english ? 'Cancel' : 'Cancelar');
    alert.addButton({
      text: 'OK',
      handler: data => {
        
        switch(data){
          case 'gps':
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
            break;

          case 'map':
            let modal = this.modalCtrl.create(LocationPickerPage);
            modal.onDidDismiss(data => {
              if(data){
                this.sightingData.lat = data.lat;
                this.sightingData.lng = data.lng;
                this.sightingData.location = data.location;
              }
            });
            modal.present();
            break;

          case 'latlon':
            this.enterLatlng();
            break;
        }

      }
    });
    alert.present();
  }

  enterLatlng(){
    let prompt = this.alertCtrl.create({
      title: this.language.english ? 'Enter lat/lng' : 'Ingresar coordenadas',
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
          text: this.language.english ? 'Cancel' : 'Cancelar',
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
        title: this.language.english ? 'Get picture from camera or gallery?' : 'Fuente de la imagen',
        buttons: [
          {
            text: this.language.english ? 'Gallery' : 'Galería',
            handler: () => {
              this.options.sourceType = this.camera.PictureSourceType.PHOTOLIBRARY;
              this.takePic()
            }
          },
          {
            text: this.language.english ? 'Camera' : 'Cámara',
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
      this.camera.getPicture(this.options).then(imageData => {
        this.picture = 'data:image/jpeg;base64,'+imageData;
        this.sightingData.img = 'data:image/jpeg;base64,'+imageData;        
        }, (err) => {
          console.log(err);
        });
    }


}
