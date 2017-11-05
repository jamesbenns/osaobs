import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';

declare var google;

@Component({
  selector: 'page-sighting-detail',
  templateUrl: 'sighting-detail.html',
})
export class SightingDetailPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  data: any;

  item: any;

  ionViewDidLoad(){
    this.loadMap();
  }

  ionViewDidEnter(){
    google.maps.event.trigger(this.map, 'resize');
  }
  
  loadMap(){

    let latLng = new google.maps.LatLng(parseFloat(this.navParams.data.lat), parseFloat(this.navParams.data.lng));

    let mapOptions = {
      center: latLng,
      zoom: 10,
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

    new google.maps.Marker({
      map: this.map,
      position: latLng
    });

  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public photoViewer: PhotoViewer) {
    this.item = this.navParams.data;
  }

}
