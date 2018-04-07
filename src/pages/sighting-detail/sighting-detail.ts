import { Component, ViewChild, ElementRef } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { SpeciesTabsPage } from '../species-tabs/species-tabs';
import { SocialSharing } from '@ionic-native/social-sharing';
import { LanguageProvider } from '../../providers/language/language';

declare var google;

@Component({
  selector: 'page-sighting-detail',
  templateUrl: 'sighting-detail.html',
})
export class SightingDetailPage {

  @ViewChild('map') mapElement: ElementRef;

  map: any;
  data: any;
  speciesTabsPage = SpeciesTabsPage;
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

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public photoViewer: PhotoViewer,
    private share: SocialSharing,
    public language: LanguageProvider
  ){
    this.item = this.navParams.data;
  }

  shareItem(){
    this.share.share(`${this.item.species ? this.item.species : 'Unknown species'} seen in ${this.item.location ? this.item.location : 'Costa Rica'}! Get the OSA Ecology app.`, `Seen on OSA Ecology app`, this.item.img, "https://www.osaecology.org")
  }

}
