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
  beta = '';
  gamma = '';
  alpha = '';
  debug = 'Logs: ';
  initialCoords = { zumoId:1, alpha:0, beta:0, gamma:0 };

  constructor(private http: HttpClient, private winRef: WindowRef) {
    this.http.get(this.url + '/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });
  }

  ngOnInit() {
    if ('ondeviceorientation' in this.winRef.nativeWindow) {
      this.debug += ' ondeviceorientation enabled';
      this.winRef.nativeWindow.addEventListener('deviceorientation', function(event) {
        let coords =  {
          zumoId: 1,
          alpha: Math.round(event.alpha),
          gamma: this.convertForArduino(Math.round(event.gamma)),
          beta: this.convertForArduino(Math.round(event.beta)),
        };
        this.alpha = Math.round(coords.alpha);
        this.gamma = Math.round(coords.gamma);
        this.beta = Math.round(coords.beta);
        if (this.initialCoords.gamma != coords.gamma || this.initialCoords.beta != coords.beta) { /* Persist to DB if updated */
          this.initialCoords.gamma = coords.gamma;
          this.initialCoords.beta = coords.beta;
          this.updateCoordsInDB(coords);
        }
     }.bind(this), true);
    } else {
      this.debug += ' ondeviceorientation NOT enabled';
    }
  }

  convertForArduino = (value: number) => {
    if (value < -15) {
      return -1;
    } else if (value > 15) {
      return 1;
    }
    return 0;
  }

  select = (song: any) => {
    this.songs.forEach(e => {
      if (e._id === song._id) {
        e.selected = !e.selected;
        this.updateSongInDB(e);
      } else if (e.selected) {
        e.selected = false;
        this.updateSongInDB(e);
      }
    });
  }

  updateCoordsInDB = (coords: any) => {
    this.http.post(this.url + '/api/coords', coords).subscribe(data => {}, err => {
      this.debug = err.message;
      console.log(`Error occured: ${err.message}`);
    });
  }

  updateSongInDB = (song: any) => {
    this.http.post(this.url + '/api/songs', song).subscribe(data => {}, err => {
      this.debug = err.message;
      console.log(`Error occured: ${err.message}`);
    });
  }

}
