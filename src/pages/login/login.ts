import { Component } from '@angular/core';
import { NavController, LoadingController, AlertController } from 'ionic-angular';
import { LanguageProvider } from '../../providers/language/language';
import { UserProvider } from '../../providers/user/user';

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})

export class LoginPage {

  constructor(
    public navCtrl: NavController,
    public user: UserProvider,
    public language: LanguageProvider,
    private loadingCtrl: LoadingController,
    private alertCtrl: AlertController
  ){}

  loading;

  tab: string = 'signup';

  createLoading(){
    this.loading = this.loadingCtrl.create({
      content: this.language.english ? 'Loading...' : 'Cargando...'
    });
    this.loading.present();    
  }

  showAlert(subTitle) {
    const alert = this.alertCtrl.create({
      title: 'Error',
      subTitle,
      buttons: ['OK']
    });
    alert.present();
  }

  signUp(email, password){
    this.createLoading();
    this.user.signUp(email, password)
    .then( () => {
      this.navCtrl.popToRoot();
      this.loading.dismiss();
    })
    .catch( error => {
      this.loading.dismiss();
      this.showAlert(error.message)
    });
  }

  login(email, password){
    this.createLoading();
    this.user.logIn(email, password).then(()=>{
      this.navCtrl.popToRoot();
      this.loading.dismiss();
    })
    .catch(error => {
      this.loading.dismiss();
      this.showAlert(error.message)
    });
  }

}
