import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WindowRef } from './windowRef';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  songs: any[] = [];
  // url: string = 'http://localhost:3000';
  url: string = '';
  x = '';
  y = '';
  z = '';
  debug = 'Debug str ';
  rotation = '';
  acceleration = '';

  constructor(private http: HttpClient, private winRef: WindowRef) {
    this.http.get(this.url + '/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });

    if ('DeviceMotionEvent' in winRef.nativeWindow) {
      this.debug = 'Device Motion API found';
      winRef.nativeWindow.addEventListener('devicemotion', this.onDeviceMotion, false);
    } else {
      this.debug = 'Device Motion not found';
    }
    // winRef.nativeWindow.addEventListener("devicemotion", this.handleOrientation);
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
