import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { ReportSightingPage } from '../../pages/report-sighting/report-sighting';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SightingDetailPage } from '../../pages/sighting-detail/sighting-detail';

declare var google;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  data: any;

  ionViewDidLoad(){
    this.loadMap();
  }

  constructor(public navCtrl: NavController, public firebase: FirebaseProvider, public photoViewer: PhotoViewer) {
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
        //  minZoom: 7,
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


        this.firebase.database.ref('sightings/').on('value', data => {
          this.data = data.val();
          this.addMarkers();
        });
   
     }

     openWindow:any;

     markers = {};

     viewSighting(data){
      this.navCtrl.push(SightingDetailPage, data)      
     }

     addMarkers(){
        for(let key in this.data){
          if(!this.markers[key]){
            let position = {lat: parseFloat(this.data[key].lat), lng: parseFloat(this.data[key].lng)};
            let marker = new google.maps.Marker({
              map: this.map,
              animation: google.maps.Animation.DROP,
              position: position
            });
  
            let infoWindow = new google.maps.InfoWindow({
              content: '<div>'+ this.data[key].species +' seen in '+ this.data[key].location +'. <a id="'+ key +'">View</a></div>',
              maxWidth: 100
            });
  
            google.maps.event.addListener(infoWindow, 'domready', () => {
              document.getElementById(key).onclick = ()=>{
                this.viewSighting(this.data[key]);
               };
            });
            
            google.maps.event.addListener(marker, 'click', () => {
              infoWindow.open(this.map, marker);
              if(this.openWindow){
                this.openWindow.close();            
              }
              this.openWindow = infoWindow;          
            });
            this.markers[key] = marker; 
          }       
        }

     }

}
