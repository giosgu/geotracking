import { Injectable, NgZone } from '@angular/core';
import { BackgroundGeolocation, BackgroundGeolocationResponse, BackgroundGeolocationConfig, BackgroundGeolocationEvents } from '@ionic-native/background-geolocation';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { LocationAccuracy } from '@ionic-native/location-accuracy';



@Injectable()
export class LocationTrackerProvider {

  public watch: any;    
  public lat: number = 0;
  public lng: number = 0;
  private coordenadas:Array<[number, number]>=new Array();

  constructor(public zone: NgZone, public geolocation:Geolocation, public backgroundGeolocation:BackgroundGeolocation, 
    public locationAccuracy:LocationAccuracy) {
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
          console.info(Date() + " background location: " + location.latitude + " " + location.longitude);
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
        
        console.info(Date() + " foreground location: " + position.coords.latitude + " " + position.coords.longitude);
        let coordenada:[number, number] = [position.coords.latitude, position.coords.longitude ]
        this.coordenadas.push(coordenada)
        // Run update inside of Angular's zone
        this.zone.run(() => {
          this.lat = position.coords.latitude;
          this.lng = position.coords.longitude;
        });
        
    });

    //solicito que se habilite el GPS, si no estuviera.
    this.locationAccuracy.canRequest().then((canRequest: boolean) => {
      if(canRequest) {
        // the accuracy option will be ignored by iOS
        this.locationAccuracy.request(this.locationAccuracy.REQUEST_PRIORITY_HIGH_ACCURACY).then(() => {
          console.log('Se habilitó el uso del GPS')

        },error => console.log('Error requesting location permissions', error)
        );
      }
    });
      
  }
    
  stopTracking() {
    
    console.info('stopTracking');
    this.backgroundGeolocation.stop();
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
