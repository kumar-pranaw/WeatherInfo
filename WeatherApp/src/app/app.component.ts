import { Component, ViewChild, ElementRef, NgZone, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {} from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  @ViewChild('search')

  public searchElementRef: ElementRef;
  public zoom: number;
  public latitude: number;
  public longitude: number;

  public latlongs: any = [];
  public latlong: any = {};

  private appId: string;
  private appCode: string;

  public weather: any;

  public searchControl: FormControl;
  constructor(private mapsApiLoader: MapsAPILoader, private ngZone: NgZone, private http: HttpClient) {
        this.appId = 'XALyASkSMXgA3PTkP3BY';
        this.appCode = 'B6LmueB_0U_eMwgwm1jYSw';
        this.weather = [];
    this.weather = [];
  }
  ngOnInit() {
    this.zoom = 8;
    this.latitude = 39.8282;
    this.longitude = -98.5795;

    this.searchControl = new FormControl();

      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(() => {
          this.getWeather();
        });
    } else {
        console.error('The browser does not support geolocation...');
    }

    this.mapsApiLoader.load().then(() => {
      const autoComplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: [],
        componentRestrictions: {'country': 'IN'}
      });
      autoComplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          const place: google.maps.places.PlaceResult = autoComplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return ;
          } else {
            const latlong = {
              latitude : place.geometry.location.lat,
              longitude: place.geometry.location.lng
            };
            this.latlongs.push(latlong);
            console.log(latlong.longitude);
            this.searchControl.reset();
          }
        });
      });
    });

  }

 public getWeather() {
  console.log(this.latitude, this.longitude);
   this.http.jsonp('https://weather.cit.api.here.com/weather/1.0/report.json?product=forecast_7days_simple&latitude='
                                   + 39.8282 +  '&longitude=' + -98.5795 +
                                   '&app_id=' +  + '&app_code=' + this.appCode, 'jsonpCallback')
                                   .pipe(map(result => (<any>result).dailyForecasts.forecastLocation))
                                   .subscribe(result => {
                                                this.weather = result.forecast;
                                                console.log(this.weather);
                                  }, error => {
            console.error(error);
        });
 }
}
