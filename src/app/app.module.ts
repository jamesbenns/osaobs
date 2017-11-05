import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { ListPage } from '../pages/list/list';
import { ReportSightingPage } from '../pages/report-sighting/report-sighting';
import { SightingDetailPage } from '../pages/sighting-detail/sighting-detail';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { Geolocation } from '@ionic-native/geolocation';
import { Camera } from '@ionic-native/camera';
import { PhotoViewer } from '@ionic-native/photo-viewer';

import { FirebaseProvider } from '../providers/firebase/firebase';

import { HttpModule } from '@angular/http';

import { PipesModule } from '../pipes/pipes.module';
import {TimeAgoPipe} from 'time-ago-pipe'


@NgModule({
  declarations: [
    MyApp,
    HomePage,
    ListPage,
    ReportSightingPage,
    SightingDetailPage,
    TimeAgoPipe   
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
    ListPage,
    ReportSightingPage,
    SightingDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    PhotoViewer,
    Geolocation,
    Camera,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    FirebaseProvider,
  ]
})
export class AppModule {}
