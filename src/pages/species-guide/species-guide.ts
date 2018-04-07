import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { FirebaseProvider } from '../../providers/firebase/firebase';
import { SpeciesTabsPage } from '../species-tabs/species-tabs'
import { LanguageProvider } from '../../providers/language/language';

@Component({
  selector: 'page-species-guide',
  templateUrl: 'species-guide.html',
})
export class SpeciesGuidePage {

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public firebase: FirebaseProvider,
    public language: LanguageProvider
  ){}

  subCategoryPage = SpeciesGuidePage;
  speciesTabsPage = SpeciesTabsPage;

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
      this.title = this.language.english ? "Species guide" : "Guía de especies";
      this.firebase.database.ref('speciesGuide/categories').on('value', data => {
        this.categories = data.val();
      });
    }
  }

}
