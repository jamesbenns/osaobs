import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { SpeciesGuidePage } from '../pages/species-guide/species-guide';
import { ReportSightingPage } from '../pages/report-sighting/report-sighting';
import { SightingDetailPage } from '../pages/sighting-detail/sighting-detail';
import { SpeciesTabsPage } from '../pages/species-tabs/species-tabs';
import { SpeciesModalPage } from '../pages/species-modal/species-modal';
import { SelectSpeciesPage } from '../pages/select-species/select-species';
import { InfoTabPage } from '../pages/info-tab/info-tab';
import { SightingsTabPage } from '../pages/sightings-tab/sightings-tab';
import { LocationPickerPage } from '../pages/location-picker/location-picker';
import { MySightingsPage } from '../pages/my-sightings/my-sightings';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SocialSharing } from '@ionic-native/social-sharing';
import { NativeStorage } from '@ionic-native/native-storage';

import { FirebaseProvider } from '../providers/firebase/firebase';
import { LanguageProvider } from '../providers/language/language';

import { HttpModule } from '@angular/http';

import { PipesModule } from '../pipes/pipes.module';
import { TimeAgoPipe } from 'time-ago-pipe'
import { LoginPage } from '../pages/login/login';
import { UserProvider } from '../providers/user/user';
import { SponsorsPage } from '../pages/sponsors/sponsors';


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ReportSightingPage,
    SightingDetailPage,
    SpeciesGuidePage,
    SpeciesModalPage,
    SpeciesTabsPage,
    SelectSpeciesPage,
    TimeAgoPipe,
    SightingsTabPage,
    LocationPickerPage,
    InfoTabPage,
    MySightingsPage,
    LoginPage,
    SponsorsPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    PipesModule,
    IonicModule.forRoot(MyApp),
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    ReportSightingPage,
    SpeciesModalPage,
    SightingDetailPage,
    SpeciesGuidePage,
    SpeciesTabsPage,
    SelectSpeciesPage,
    SightingsTabPage,
    LocationPickerPage,
    InfoTabPage,
    MySightingsPage,
    LoginPage,
    SponsorsPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PhotoViewer,
    InAppBrowser,
    SocialSharing,
    NativeStorage,
    Geolocation,
    Camera,
    {
      provide: ErrorHandler,
      useClass: IonicErrorHandler
    },
    FirebaseProvider,
    LanguageProvider,
    UserProvider,
  ]
})
export class AppModule {}
