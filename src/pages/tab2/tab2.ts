import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AlertController, IonicPage, Loading, LoadingController, NavController} from 'ionic-angular';
import {Push} from '@ionic-native/push';
import {PhonegapLocalNotification} from "@ionic-native/phonegap-local-notification";
import {UserServiceProvider} from "../../providers/user-service/user-service";


declare var google;

@IonicPage()
@Component({
  selector: 'page-tab2',
  templateUrl: 'tab2.html',
})
export class Tab2Page implements OnInit {
  @ViewChild('map') mapElement: ElementRef;
  loading: Loading;
  map: google.maps.Map;
  start = 'chicago, il';
  end = 'chicago, il';
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  geocoder: google.maps.Geocoder;
  lat: number = 0;
  lng: number = 0;


  constructor(public navCtrl: NavController, private loadingCtrl: LoadingController, private alertCtrl: AlertController, private push: Push, private localNotification: PhonegapLocalNotification, private userService: UserServiceProvider) {
    this.localNotification.requestPermission().then(
      (permission) => {
        if (permission === 'granted') {

          // Create the notification
          this.localNotification.create('I AM WORKING', {
            tag: 'message1',
            body: 'Welcome:',
            icon: 'assets/icon/favicon.ico'
          });

        }
      })
      .catch(error => console.log("Error : " + error));
  }

  ionViewCanEnter(): boolean {
    return true;
  }

  ngOnInit() {
    this.showLoading();
    this.geocoder = new google.maps.Geocoder();
    this.geocoder.geocode({'address': 'polska'}, (results, status) => {
      if (status.toString() === 'OK') {
        this.lng = results[0].geometry.location.lng();
        this.lat = results[0].geometry.location.lat();
        this.initMap();
      }
      else {
        this.showError("CHYBA SIE DUPLO");
      }
      this.loading.dismissAll();
    })
  }


  initMap() {
    this.map = new google.maps.Map(this.mapElement.nativeElement, {
      zoom: 4,
      center: {lat: this.lat, lng: this.lng}
    });
    this.directionsDisplay.setMap(this.map);
  }

  addMarker() {

    let marker = new google.maps.Marker({
      map: this.map,
      animation: google.maps.Animation.DROP,
      position: this.map.getCenter()
    });

    let content = "<h4>Information!</h4>";

    // this.addInfoWindow(marker, content);

    let infoWindow = new google.maps.InfoWindow({
      content: content
    });

    google.maps.event.addListener(marker, 'click', () => {
      infoWindow.open(this.map, marker);
    });

  }


  calculateAndDisplayRoute() {
    this.showLoading();
    this.directionsService.route({
      origin: this.start,
      destination: this.end,
      travelMode: 'DRIVING'
    }, (response, status) => {
      if (status === 'OK') {
        this.loading.dismissAll();
        this.directionsDisplay.setDirections(response);
      } else {
        this.showError(status);
      }
    });
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
  }

  showError(text) {
    this.loading.dismiss();

    let alert = this.alertCtrl.create({
      title: 'Fail',
      subTitle: text,
      buttons: ['OK']
    });
    alert.present();
  }

}
