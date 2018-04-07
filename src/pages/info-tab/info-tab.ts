import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { LanguageProvider } from '../../providers/language/language';

interface species {
  description?: string,
  name?: string,
  spanishDescription?: string,
  spanishName?: string,
  binomialName?: string
}

@Component({
  selector: 'page-info-tab',
  templateUrl: 'info-tab.html',
})
export class InfoTabPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebase: FirebaseProvider,
    public photoViewer: PhotoViewer,
    public language: LanguageProvider
  ){
    this.species = this.navParams.data;
  }

  species: species = {};

  ionViewDidLoad() {
    if(!this.species.description){

      this.firebase.database.ref('speciesGuide/species').orderByChild('name').equalTo(this.species.name).once("child_added").then( snapshot => {
        Object.assign(this.species, snapshot.val());
      }).catch(error => {console.log(error)});

    }
    else this.species = this.navParams.data;
  }

}
