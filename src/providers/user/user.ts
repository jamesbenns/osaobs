import { Injectable } from '@angular/core';
import { FirebaseProvider } from '../firebase/firebase';
import { ModalController } from 'ionic-angular';

@Injectable()
export class UserProvider {

  user: any;
  signUpError: string;

  constructor(private firebase: FirebaseProvider, public modalCtrl: ModalController) {
    firebase.auth.onAuthStateChanged(user => this.user = user);
  }

  signUp(email, password){
    return this.firebase.auth.createUserWithEmailAndPassword(email, password)
  }

  logIn(email, password){
    return this.firebase.auth.signInWithEmailAndPassword(email, password)
  }

  logout(){
    this.firebase.auth.signOut();
  }

}
