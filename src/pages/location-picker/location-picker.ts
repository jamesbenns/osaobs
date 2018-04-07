import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { Http } from '@angular/http';
import { LanguageProvider } from '../../providers/language/language';

declare var google;

@Component({
  selector: 'page-location-picker',
  templateUrl: 'location-picker.html',
})
export class LocationPickerPage {

  @ViewChild('map') mapElement: ElementRef;
  map: any;
  marker: any = false;
  location: string = "";

  data = {
    lat: "",
    lng: "",
    location: ""
  }

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private http: Http,
    public language: LanguageProvider
  ) {}

  ionViewDidLoad(){
    this.loadMap();
  }

  dismiss() {
    this.viewCtrl.dismiss(this.data);
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

      //Listen for any clicks on the map.
      google.maps.event.addListener(this.map, 'click', event => {                
        //Get the location that the user clicked.
        var clickedLocation = event.latLng;
        //If the marker hasn't been added.
        if(this.marker === false){
            //Create the marker.
            this.marker = new google.maps.Marker({
                position: clickedLocation,
                map: this.map,
                draggable: true //make it draggable
            });
            //Listen for drag events!
            google.maps.event.addListener(this.marker, 'dragend', event => {
              this.setLocation();
            });
        } else{
            //Marker has already been added, so just change its location.
            this.marker.setPosition(clickedLocation);
        }
        //Get the marker's location.
        this.setLocation();
      });

  }

  setLocation(){
    let location = this.marker.getPosition();
    this.data.lat = location.lat().toString();
    this.data.lng = location.lng().toString();
    this.getAddress();
  }

  getAddress(){
  
    let url = "https://maps.googleapis.com/maps/api/geocode/json?latlng="+ decodeURI(this.data.lat) +","+ decodeURI(this.data.lng) +"&key=AIzaSyC8LqnQR4-HhO4haik-QEAt79QFosXnEbA&result_type=locality|political|administrative_area_level_2|administrative_area_level_1";
    this.http.get(url).subscribe(data => {
      if(data.json().results.length){
        this.data.location = data.json().results[0].address_components[0].long_name;        
      } else this.data.location = "";
    },
    err => {
      console.log(err)
    });
  }

}
