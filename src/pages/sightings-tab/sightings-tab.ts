import { Component } from '@angular/core';
import { NavController, NavParams, App } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SightingDetailPage } from '../sighting-detail/sighting-detail'
import { LanguageProvider } from '../../providers/language/language';

@Component({
  selector: 'page-sightings-tab',
  templateUrl: 'sightings-tab.html',
})
export class SightingsTabPage {

  sightingDetail = SightingDetailPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private firebase: FirebaseProvider,
    public appCtrl: App,
    public language: LanguageProvider
  ){
    this.firebase.database.ref('sightings').orderByChild('species').equalTo(this.navParams.data).on("child_added", snapshot => {
      this.sightings.push(snapshot.val());
    });
  }

  sightings = [];

  goToSighting(item){
    this.appCtrl.getRootNav().push(SightingDetailPage, item)
  }

}
