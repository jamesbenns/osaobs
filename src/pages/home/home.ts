import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ReportSightingPage } from '../../pages/report-sighting/report-sighting';
import { SightingDetailPage } from '../../pages/sighting-detail/sighting-detail';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LanguageProvider } from '../../providers/language/language';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  data: any;
  scrollEnabled = false;
  sightings = [];
  allSightings = [];
  sightingDetail = SightingDetailPage;
  
  ionViewDidLoad(){
    this.loadMap();
    this.splashScreen.hide();
  }

  viewSighting(item){
    this.navCtrl.push(this.sightingDetail, item);
  }

  constructor(public navCtrl: NavController, public firebase: FirebaseProvider, private splashScreen: SplashScreen, public language: LanguageProvider) {
  }

  getMore(event){
    this.sightings = this.sightings.concat( this.allSightings.slice(this.sightings.length, this.sightings.length + 5) );
    if(this.sightings.length === this.allSightings.length) this.scrollEnabled = false;
    event.complete();
    console.log(this.allSightings.slice(this.sightings.length, this.sightings.length + 5));
  }

  report(){
    this.navCtrl.push(ReportSightingPage)
  }

  ionViewDidEnter(){
    google.maps.event.trigger(this.map, 'resize');
  }

  loadMap(){
    
       let latLng = new google.maps.LatLng(9.927158, -84.092403);
    
       let mapOptions = {
         center: latLng,
         zoom: 7,
         minZoom: 7,
         mapTypeId: google.maps.MapTypeId.ROADMAP,
         zoomControl: false,
         mapTypeControl: false,
         scaleControl: false,
         streetViewControl: false,
         rotateControl: false,
         fullscreenControl: false,
         backgroundColor: 'none',
         styles: [  {
          "featureType": "landscape.natural",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#d2e4c8"
            }
          ]
        },
        {
          "featureType": "water",
          "elementType": "geometry.fill",
          "stylers": [
            {
              "color": "#90d6ff"
            }
          ]
        }]
       }
    
       this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);

       let strictBounds = new google.maps.LatLngBounds(
          new google.maps.LatLng(7.084093, -86.000020),
          new google.maps.LatLng(11.568225, -82.242378)
       );
  
       // Listen for the dragend event
       google.maps.event.addListener(this.map, 'bounds_changed', () => {
           if (strictBounds.contains(this.map.getCenter())) return;
  
           // We're out of bounds - Move the map back within the bounds
           let c = this.map.getCenter(),
           x = c.lng(),
           y = c.lat(),
           maxX = strictBounds.getNorthEast().lng(),
           maxY = strictBounds.getNorthEast().lat(),
           minX = strictBounds.getSouthWest().lng(),
           minY = strictBounds.getSouthWest().lat();
  
           if (x < minX) x = minX;
           if (x > maxX) x = maxX;
           if (y < minY) y = minY;
           if (y > maxY) y = maxY;
  
           this.map.setCenter(new google.maps.LatLng(y, x));
       });

        this.firebase.database.ref('sightings/').limitToLast(100).on('value', data => {
          this.data = data.val();
          this.allSightings = [];
          this.sightings = [];
          for (let key in this.data) {
            this.allSightings.unshift(this.data[key]);
          }
          this.sightings = this.allSightings.slice(0,4);
          this.scrollEnabled = true;
          this.addMarkers();
        });
   
     }

     openWindow:any;

     markers = {};

     addMarkers(){

        for(let key in this.data){
          if(!this.markers[key]){
            let position = {lat: parseFloat(this.data[key].lat), lng: parseFloat(this.data[key].lng)};
            let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: position
            });

            let title = this.data[key].species ? (this.language.english ? this.data[key].species : this.data[key].spanishSpecies) : (this.language.english ? "Unidentified species" : "Especie no identificada");
  
            let infoWindow = new google.maps.InfoWindow({
              content: '<div>'+ title +'<br><a id="'+ key +'"><b>' + (this.language.english ? 'View' : 'Ver') + '</b></a></div>',
              maxWidth: 100
            });
  
            google.maps.event.addListener(infoWindow, 'domready', () => {
              document.getElementById(key).onclick = () =>{
                this.viewSighting(this.data[key]);
               };
            });
            
            google.maps.event.addListener(marker, 'click', () => {
              infoWindow.open(this.map, marker);
              if(this.openWindow && this.openWindow.content !== infoWindow.content){
                this.openWindow.close();            
              }
              this.openWindow = infoWindow;          
            });
            this.markers[key] = marker; 
          }       
        }

     }

}
