import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WindowRef } from './windowRef';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  songs: any[] = [];
  // url: string = 'http://localhost:3000';
  url: string = '';
  x = '';
  y = '';
  z = '';
  debug = 'Debug str: ';
  rotation = '';
  acceleration = '';

  constructor(private http: HttpClient, private winRef: WindowRef) {
    this.http.get(this.url + '/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });

    // if ('ondevicemotion' in winRef.nativeWindow) {
    //   this.debug = 'Device Motion API found';
    //   winRef.nativeWindow.addEventListener('devicemotion', this.onDeviceMotion, false);
    // } else {
    //   this.debug = 'Device Motion not found';
    // }
    // winRef.nativeWindow.addEventListener("devicemotion", this.handleOrientation);
  }

  ngOnInit() {

    this.winRef.nativeWindow.addEventListener('click', function() {
      this.debug += '+';
    }.bind(this), true);

    if ('ondeviceorientation' in this.winRef.nativeWindow) {
      this.debug += ' ondeviceorientation enabled ';
      this.winRef.nativeWindow.addEventListener('deviceorientation', function(event) {
        this.debug += '!';
        // document.getElementById('cube').style.webkitTransform =
        // document.getElementById('cube').style.transform =
        //         'rotateX(' + event.beta + 'deg) ' +
        //         'rotateY(' + event.gamma + 'deg) ' +
        //         'rotateZ(' + event.alpha + 'deg)';

        // document.getElementById('beta').innerHTML = Math.round(event.beta);
        // document.getElementById('gamma').innerHTML = Math.round(event.gamma);
        // document.getElementById('alpha').innerHTML = Math.round(event.alpha);
        // document.getElementById('is-absolute').innerHTML = event.absolute ? "true" : "false";
     }.bind(this), true);
    } else {
      this.debug += ' ondeviceorientation NOT enabled ';
    }
    if ('ondevicemotion' in this.winRef.nativeWindow) {
      this.debug += ' ondevicemotion enabled ';
      this.winRef.nativeWindow.addEventListener('devicemotion', function(event) {
        this.debug += '|';
      }.bind(this), true);
    } else {
      this.debug += ' ondevicemotion NOT enabled ';
    }
  }

  accelerationHandler(acceleration, targetId) {
    var info, xyz = "[X, Y, Z]";
    info = xyz.replace("X", acceleration.x && acceleration.x.toFixed(0));
    info = info.replace("Y", acceleration.y && acceleration.y.toFixed(0));
    info = info.replace("Z", acceleration.z && acceleration.z.toFixed(0));
    this.acceleration = info;
    // document.getElementById(targetId).innerHTML = info;
  }

  onDeviceMotion = (eventData) => {
    this.debug += '-'
    this.accelerationHandler(eventData.acceleration, 'moAccel');
    this.accelerationHandler(eventData.accelerationIncludingGravity, 'moAccelGrav');
    this.rotationHandler(eventData.rotationRate);
    // this.intervalHandler(eventData.interval);
  }
  
  rotationHandler(rotation) {
    var info, xyz = "[X, Y, Z]";
    info = xyz.replace("X", rotation.alpha && rotation.alpha.toFixed(0));
    info = info.replace("Y", rotation.beta && rotation.beta.toFixed(0));
    info = info.replace("Z", rotation.gamma && rotation.gamma.toFixed(0));
    this.rotation = info;
  }
  
  intervalHandler(interval) {
    document.getElementById("moInterval").innerHTML = interval;
  }

  select = (song: any) => {
    this.songs.forEach(e => {
      if (e._id === song._id) {
        e.selected = !e.selected;
        this.updateSonginDB(e);
      } else if (e.selected) {
        e.selected = false;
        this.updateSonginDB(e);
      }
    });
  }

  updateSonginDB = (song: any) => {
    this.http.post(this.url + '/api/songs', song).subscribe(data => {
      console.log('Success')
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });
  }

}
