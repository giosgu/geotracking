import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import {GoogleMap, GoogleMapsEvent, LatLng, GoogleMaps} from "@ionic-native/google-maps";
import {Geoposition} from "@ionic-native/geolocation";
declare var plugin: any;

@IonicPage()
@Component({
  selector: 'page-mostrar-recorrido',
  templateUrl: 'mostrar-recorrido.html',
})
export class MostrarRecorridoPage implements OnInit {

  map: GoogleMap;
  previousPosition: Geoposition;
  private coordenadas:Array<[number, number]>;

  
  ngOnInit(): void {
    console.log("OnInit")
    this.setMap2();
    //this.loadMap();
    //this.cargarRecorrido();
  }

  constructor(public navCtrl: NavController, public navParams: NavParams, public googleMaps: GoogleMaps) {
    console.log("constructor")
    this.coordenadas = navParams.get("coordenadas") ;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MostrarRecorridoPage');
  }

  private setMap2(){
    let latLng = new LatLng(this.coordenadas[0][0],this.coordenadas[0][1] );
    let opts = {
      controls: {
        myLocation : true,
        myLocationButton : true
      },
        camera: {
          latLng: latLng,
          zoom: 12,
          tilt: 30
        }
    };

    this.map = this.googleMaps.create('map_canvas', opts);

    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(() => {
      console.log('Map is ready!');
      this.cargarRecorrido();
    });
  }

  private setMap(){
    console.info("Comienza Set Map")
    let controls: any = {compass: true, myLocationButton: false, indoorPicker: false, zoom: true, mapTypeControl: false, streetViewControl: false};
    
    this.map = new GoogleMap('map', {
      'backgroundColor': 'white',
      'controls': {
        'compass': controls.compass,
        'myLocationButton': controls.myLocationButton,
        'indoorPicker': controls.indoorPicker,
        'zoom': controls.zoom,
        'mapTypeControl': controls.mapTypeControl,
        'streetViewControl': controls.streetViewControl
      },
      'gestures': {
        'scroll': true,
        'tilt': true,
        'rotate': true,
        'zoom': true
      }
    });
    console.info("Finaliza Set Map")
  }

  private loadMap(){
    console.info("Comienza Load Map")
    this.map.on(GoogleMapsEvent.MAP_READY).subscribe(
      (map) => {
        map.clear();
        map.off();
        map.setMapTypeId(plugin.google.maps.MapTypeId.HYBRID);
        map.setMyLocationEnabled(true);
        this.cargarRecorrido();
      },(error)=>{
        console.error("Error en load map:", error);
      }
    );
    console.info("Finaliza Load Map")
  }

  private cargarRecorrido(){
    console.info("Comienza cargar recorrido")
    console.info(this.map)
    let posicionAnterior:[number, number]= null;
    this.coordenadas.forEach(coordenada => {
      console.info("Cargando coordenada " + coordenada[0] + " " + coordenada[1])
      if(posicionAnterior == null){
        posicionAnterior = coordenada
      }
      this.map.addPolyline(
        {
          points: [new LatLng(posicionAnterior[0], posicionAnterior[1]), new LatLng(coordenada[0], coordenada[1])],
          visible: true,
          color:'#FF0000',
          width:4
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
    console.info("Finaliza cargar recorrido ")
  }

}
