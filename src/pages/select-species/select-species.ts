import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { LanguageProvider } from '../../providers/language/language';

@Component({
  selector: 'page-select-species',
  templateUrl: 'select-species.html',
})
export class SelectSpeciesPage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebase: FirebaseProvider,
    public language: LanguageProvider
  ){}

  subCategoryPage = SelectSpeciesPage;

  categories = [];
  species = [];
  title:string = '';

  ionViewDidLoad() {
    let subCategory = this.navParams.get('subCategory');
    if(subCategory){
      this.title = this.language.english ? subCategory.name : subCategory.spanishName;
      this.categories = subCategory.subCategories;
      this.firebase.database.ref('speciesGuide/species').orderByChild('category').equalTo(subCategory.name).on("child_added", snapshot => {
        this.species.push(snapshot.val());
      });
    }else{
      this.title = this.language.english ? "Select species" : "Especie selecta";
      this.firebase.database.ref('speciesGuide/categories').on('value', data => {
        this.categories = data.val();
      });
    }
  }

}
