import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, ViewController } from 'ionic-angular';
import { SelectSpeciesPage } from '../select-species/select-species';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { LanguageProvider } from '../../providers/language/language';

@Component({
  selector: 'page-species-modal',
  templateUrl: 'species-modal.html',
})
export class SpeciesModalPage {

  rootPage = SelectSpeciesPage;

  data;

  @ViewChild('myNav') nav: NavController

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    private firebase: FirebaseProvider,
    public language: LanguageProvider
  ){
    this.firebase.database.ref('speciesGuide').once('value', data => {
      this.data = data.val();
    });
  }

  dismiss() {
    let data = this.nav.getActive().instance.selected;
    this.viewCtrl.dismiss(data);
  }

}
