import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationResponse, BackgroundGeolocationConfig, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';



@Injectable()
export class LocationTrackerProvider {

  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  private coordenadas:Array<[number, number]>=new Array();

  constructor(public zone: NgZone, public geolocation:Geolocation, public backgroundGeolocation:BackgroundGeolocation) {
    console.log('Hello LocationTrackerProvider Provider');
  }

  startTracking() {
    this.coordenadas=new Array();
    const config: BackgroundGeolocationConfig = {
      desiredAccuracy: 0,
      stationaryRadius: 20,
      distanceFilter: 10,
      debug: true, //  enable this hear sounds for background-geolocation life-cycle.
      stopOnTerminate: false, // enable this to clear background location settings when the app terminates
      interval: 2000 
    };

    this.backgroundGeolocation.configure(config).then(() => {
      this.backgroundGeolocation
        .on(BackgroundGeolocationEvents.location)
        .subscribe((location: BackgroundGeolocationResponse) => {
          console.log(Date() + " background location: " + location.latitude + " " + location.longitude);
          let coordenada:[number, number] = [location.latitude, location.longitude ]
          this.coordenadas.push(coordenada)
        });
    });

    // start recording location
    this.backgroundGeolocation.start();

     // Foreground Tracking
    let options = {
      frequency: 3000, 
      enableHighAccuracy: true
      
    };

    this.watch = this.geolocation.watchPosition(options).subscribe((position: Geoposition) => {

      console.log(Date() + " foreground location: " + position.coords.latitude + " " + position.coords.longitude);
      let coordenada:[number, number] = [position.coords.latitude, position.coords.longitude ]
      this.coordenadas.push(coordenada)
      // Run update inside of Angular's zone
      this.zone.run(() => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });

    });
    
  }

  stopTracking() {

    console.log('stopTracking');
    this.backgroundGeolocation.finish();
    this.watch.unsubscribe();
    console.info("Stop Tracking. Las coordenadas registraron fueron: ")
    this.coordenadas.forEach(element => {
      console.info(element[0], element[1], )
    });

  }

  public getCoordenadas():Array<[number, number]>{
    return this.coordenadas;
  }
}
