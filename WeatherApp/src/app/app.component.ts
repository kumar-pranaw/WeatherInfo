import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {} from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  @ViewChild('search')

  public searchElementRef: ElementRef;
  public zoom: number;
  public latitude: number;
  public longitude: number;
  oldLocationName = '';
  newLocationname = 'Mohali';

  public searchControl: FormControl;
  public latlongs: any = [];
  public latlong: any = {};
  private appId: string;
  private appCode: string;

  public weather: any;

  public constructor(private http: HttpClient, private mapsApiLoader: MapsAPILoader, private ngZone: NgZone) {
      this.appId = 'XALyASkSMXgA3PTkP3BY';
      this.appCode = 'B6LmueB_0U_eMwgwm1jYSw';
      this.weather = [];
  }

  public ngOnInit() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(position => {
          this.getWeather(position.coords);
      });

  } else {
      console.error('The browser does not support geolocation...');
  }

    this.searchControl = new FormControl();
    this.mapsApiLoader.load().then(() => {
            const autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
              types: [],
              // componentRestrictions: {'country': 'IN'}
            });
            autoComplete.addListener('place_changed', () => {
              this.ngZone.run(() => {
                const place: google.maps.places.PlaceResult = autoComplete.getPlace();
                if (place.geometry === undefined || place.geometry === null) {
                  return ;
                } else {
                  const latlong = {
                    latitude : place.geometry.location.lat(),
                    longitude: place.geometry.location.lng()
                  };
                 // this.searchControl.reset();
                 console.log(latlong.latitude + '' + latlong.longitude);
                 this.getWeather(latlong);
                }
              });
            });
          });
}




  public getWeather(coordinates: any) {
    this.http.jsonp('https://weather.cit.api.here.com/weather/1.0/report.json?product=forecast_7days_simple&latitude='
     + coordinates.latitude + '&longitude=' + coordinates.longitude +
      '&app_id=' + this.appId + '&app_code=' + this.appCode, 'jsonpCallback')
    .pipe(map(result => (<any>result).dailyForecasts.forecastLocation))
    .subscribe(result => {
        this.weather = result.forecast;
    }, error => {
        console.error(error);
    });
  }

  onLocationChange() {

  }


  onLocationSelect(locationSubmit) {
    // console.log(geoloc);
    const place: google.maps.places.PlaceResult = locationSubmit;
    console.log('Place: ' + place);
    if (place.geometry.location.lat === undefined || place.geometry.location.lng === null) {
      console.log('Undefined Data');
      return ;
    } else {
      const latlong = {
        latitude : place.geometry.location.lat,
        longitude: place.geometry.location.lng
      };
      console.log('Latitude and longitude' + latlong);
  }
}

}
