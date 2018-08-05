import { Injectable } from '@angular/core';
import * as firebase from 'firebase';
import * as cloudinary from 'cloudinary';

@Injectable()
export class FirebaseProvider {

  database: any;
  markers: any;
  data = {};
  storage:any;
  auth: any;
  connection;

  constructor() {
    
    const config = {
      apiKey: "AIzaSyC8LqnQR4-HhO4haik-QEAt79QFosXnEbA",
      authDomain: "osaobs-6b449.firebaseapp.com",
      databaseURL: "https://osaobs-6b449.firebaseio.com",
      projectId: "osaobs-6b449",
      storageBucket: "osaobs-6b449.appspot.com",
      messagingSenderId: "770570597964"
    };

    cloudinary.config({ 
      cloud_name: 'dfssbem3h', 
      api_key: '924727136572693', 
      api_secret: 'dy2_I_YB2LNLoK8sUa60HFip2W8' 
    });

    firebase.initializeApp(config);
    this.database = firebase.database();
    this.storage = firebase.storage();
    this.auth = firebase.auth();

  }

  getPhotoUrl(url){
    const term = "/upload/";
    const index = url.indexOf(term) + term.length;
    return `${url.substr(0,index)}h_1000/${url.substr(index)}`;
  }

  addSighting(data){
    data.key = this.database.ref('sightings/').push().key;   
    return new Promise((resolve, reject)=>{
      if(data.img){

        cloudinary.uploader.upload( data.img, result => {
          data.img = result.secure_url;
          resolve(this.database.ref('sightings/' + data.key).set(data));
        });

      } else{

        this.database.ref('sightings/' + data.key).set(data).then( success => {
          resolve();
        }, error => {
          reject(error);
        });

      }
    })
  }

}
