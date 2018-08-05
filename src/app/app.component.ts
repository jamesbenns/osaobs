import { Component, ViewChild } from '@angular/core';
import { Nav, Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { HomePage } from '../pages/home/home';
import { SpeciesGuidePage } from '../pages/species-guide/species-guide';
import { ReportSightingPage } from '../pages/report-sighting/report-sighting';
import { MySightingsPage } from '../pages/my-sightings/my-sightings';
import { LanguageProvider } from '../providers/language/language';
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';
import { SponsorsPage } from '../pages/sponsors/sponsors';

@Component({
  templateUrl: 'app.html'
})
export class MyApp {

  @ViewChild(Nav) nav: Nav;

  rootPage: any;

  constructor(
    public platform: Platform,
    public statusBar: StatusBar,
    private iab: InAppBrowser,
    public language: LanguageProvider,
    public userService: UserProvider,
  ){
    this.initializeApp();
  }

  initializeApp() {
    this.language.getLanguage().then(()=>this.rootPage = HomePage);
    this.platform.ready().then(() => this.statusBar.styleDefault());
  }

  openLink(url){
    this.iab.create(url, '_self', 'location=no');
  }

  openSponsors(){
    this.nav.push(SponsorsPage);
  }

  onHomePage(){
    if(this.nav.canGoBack()) {return false} else return true
  }

  openSpeciesGuide(){
    this.nav.push(SpeciesGuidePage);
  }

  openLoginPage(){
    this.nav.push(LoginPage);
  }

  openMySightings(){
    this.nav.push(MySightingsPage);
  }

  reportSighting(){
    this.nav.push(this.userService.user ? ReportSightingPage : LoginPage);
  }

  saveLanguage(){
    this.language.setLanguage();
  }
  
}
