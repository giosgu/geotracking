import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { LocationTrackerProvider } from '../../providers/location-tracker/location-tracker';
import { MostrarRecorridoPage } from '../mostrar-recorrido/mostrar-recorrido';
import { AboutPage } from '../about/about';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  private coordenadas:Array<[number, number]>=new Array();

  constructor(public navCtrl: NavController, public locationTracker: LocationTrackerProvider) {

  }

  start(){
    this.coordenadas = new Array();
    this.locationTracker.startTracking();
  }

  stop(){
    this.locationTracker.stopTracking();
    //this.coordenadas = this.locationTracker.getCoordenadas();
    this.navCtrl.push(AboutPage, {coordenadas:this.locationTracker.getCoordenadas()})
   }

}
