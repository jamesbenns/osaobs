import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import * as firebase from 'firebase';

@Injectable()
export class FirebaseProvider {

  database: any;
  markers: any;
  data = {};
  storage:any;

  constructor(public http: Http) {
    
    let config = {
      apiKey: "AIzaSyC8LqnQR4-HhO4haik-QEAt79QFosXnEbA",
      authDomain: "osaobs-6b449.firebaseapp.com",
      databaseURL: "https://osaobs-6b449.firebaseio.com",
      projectId: "osaobs-6b449",
      storageBucket: "osaobs-6b449.appspot.com",
      messagingSenderId: "770570597964"
    };

    firebase.initializeApp(config);
    this.database = firebase.database();
    this.storage = firebase.storage();
    

  }

  getData(){
    return new Promise((resolve, reject) => {
      this.database.ref('sightings/').on('value', data => {
        this.data = data.val();
        resolve(data.val())
      });
    })
  }

  addSighting(data){
    let key = this.database.ref('sightings/').push().key;    
      return new Promise((resolve, reject)=>{
        if(data.img){
          this.storage.ref().child(key).putString(data.img, 'data_url').then( snapshot => {
            data.img = snapshot.downloadURL;
            resolve();
            return this.database.ref('sightings/' + key).set(data);
          }, error => {
            reject(error)
          });
        } else{
          this.database.ref('sightings/' + key).set(data).then( success => {
            resolve();
          }, error => {
            reject(error);
          })          
        }
      })
  }

}
