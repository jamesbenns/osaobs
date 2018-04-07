import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { NativeStorage } from '@ionic-native/native-storage';

import { HomePage } from '../pages/home/home';
import { SpeciesGuidePage } from '../pages/species-guide/species-guide';
import { ReportSightingPage } from '../pages/report-sighting/report-sighting';
import { MySightingsPage } from '../pages/my-sightings/my-sightings';
import { LanguageProvider } from '../providers/language/language';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any = HomePage;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    private iab: InAppBrowser,
    public language: LanguageProvider,
    private storage: NativeStorage
  ){
    this.initializeApp();
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.language.getLanguage();
      this.statusBar.styleDefault();
    });
  }

  openLink(url){
    this.iab.create(url, '_self', 'location=no');
  }

  onHomePage(){
    if(this.nav.canGoBack()) {return false} else return true
  }

  openSpeciesGuide(){
    this.nav.push(SpeciesGuidePage);
  }

  openMySightings(){
    this.nav.push(MySightingsPage);
  }

  reportSighting(){
    this.nav.push(ReportSightingPage);
  }

  saveLanguage(){
    this.storage.setItem('language', { english: this.language.english })
    .then(
      () => console.log('Stored item!'),
      error => console.error('Error storing item', error)
    );
  }
  
}
