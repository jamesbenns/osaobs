import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { SightingsTabPage } from '../sightings-tab/sightings-tab';
import { InfoTabPage } from '../info-tab/info-tab';
import { LanguageProvider } from '../../providers/language/language';

@Component({
  selector: 'page-species-tabs',
  templateUrl: 'species-tabs.html'
})
export class SpeciesTabsPage {

  infoRoot = InfoTabPage;
  sightingsRoot = SightingsTabPage;
  species = {};

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public language: LanguageProvider
  ){
    this.species = this.navParams.data;
  }

}
