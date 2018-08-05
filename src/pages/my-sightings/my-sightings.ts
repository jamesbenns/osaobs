import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SightingDetailPage } from '../../pages/sighting-detail/sighting-detail';
import { LanguageProvider } from '../../providers/language/language';
import { UserProvider } from '../../providers/user/user';

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
    private firebase: FirebaseProvider,
    public language: LanguageProvider,
    public user: UserProvider
  ){
    this.firebase.database.ref('sightings')
    .orderByChild('uid')
    .equalTo(this.user.user.uid)
    .on("child_added", snapshot => this.sightings.push(snapshot.val()) );
  }

}
