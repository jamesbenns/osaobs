import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { FirebaseProvider } from '../../providers/firebase/firebase';

@Component({
  selector: 'page-sponsors',
  templateUrl: 'sponsors.html',
})
export class SponsorsPage {

  constructor(public navCtrl: NavController, public navParams: NavParams, private iab: InAppBrowser, private firebase: FirebaseProvider) {
    this.firebase.database.ref('collaborators/').on('value', data => {
      this.sponsors = data.val();
    });
  }

  sponsors: Array<Object>;

  openLink(url){
    this.iab.create(url, '_self', 'location=no');
  }

}
