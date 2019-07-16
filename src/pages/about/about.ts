import { Component, ViewChild } from '@angular/core';
import { NavController, Platform, NavParams } from 'ionic-angular';
import { GoogleMaps, GoogleMap, GoogleMapsEvent, LatLng, MarkerOptions, Marker } from '@ionic-native/google-maps';

@Component({
  selector: 'page-about',
  templateUrl: 'about.html'
})
export class AboutPage {

  @ViewChild('map') element;
  private coordenadas:Array<[number, number]>;

  constructor(public googleMaps: GoogleMaps, public plt: Platform, public nav: NavController, public navParams: NavParams) {
    this.coordenadas = navParams.get("coordenadas") ;
  }

  ngAfterViewInit() {
    this.plt.ready().then(() => {
      this.initMap();
    });
  }

  initMap() {

    let map: GoogleMap = this.googleMaps.create(this.element.nativeElement);

    map.one(GoogleMapsEvent.MAP_READY).then((data: any) => {

      let coordinates: LatLng = new LatLng(this.coordenadas[0][0], this.coordenadas[0][1]);
       
      let position = {
        target: coordinates,
        zoom: 12
      };

      map.animateCamera(position);
      let posicionAnterior:[number, number]= null;
    this.coordenadas.forEach(coordenada => {
      console.info("Cargando coordenada " + coordenada[0] + " " + coordenada[1])
      if(posicionAnterior == null){
        posicionAnterior = coordenada
      }
      map.addPolyline(
        {
          points: [new LatLng(posicionAnterior[0], posicionAnterior[1]), new LatLng(coordenada[0], coordenada[1])],
          visible: true,
          color:'#FF0000',
          width:10
        }).then(
        (res)=>{
          posicionAnterior = coordenada
        }
      ).catch(
        (err)=>{
          console.log("err: "+JSON.stringify(err));
        }
      );
      
    });

    })
  }


}
