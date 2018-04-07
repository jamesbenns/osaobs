import { Injectable } from '@angular/core';
import { NativeStorage } from '@ionic-native/native-storage';

@Injectable()
export class LanguageProvider {

  english: boolean;

  constructor(
    private storage: NativeStorage
  ){}

  getLanguage(){
    this.storage.getItem('language').then(
      data => {
        this.english = data.english
      },
      error => {
        console.error(error)
        this.english = true;
      }
    );
  }

}
