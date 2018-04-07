import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Device } from '@ionic-native/device';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SightingDetailPage } from '../../pages/sighting-detail/sighting-detail';
import { LanguageProvider } from '../../providers/language/language';

@Component({
  selector: 'page-my-sightings',
  templateUrl: 'my-sightings.html',
})
export class MySightingsPage {

  sightings = [];
  sightingDetail = SightingDetailPage;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private device: Device,
    private firebase: FirebaseProvider,
    public language: LanguageProvider
  ){

    this.firebase.database.ref('sightings').orderByChild('uuid').equalTo(this.device.uuid || "").on("child_added", snapshot => {
      this.sightings.push(snapshot.val());
    });

  }

}
