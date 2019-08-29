import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { WindowRef } from './windowRef';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  songs: any = [];
  // url: string = 'http://localhost:3000';
  url: string = '';
  beta = '';
  gamma = '';
  alpha = '';
  debug = 'No logs currently';
  deviceEnabled = '';
  initialCoords = { zumoId:1, alpha:0, beta:0, gamma:0 };

  constructor(private http: HttpClient, private winRef: WindowRef) {
    this.http.get(this.url + '/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      this.debug = `Error occured: ${err.message}`;
    });
  }

  ngOnInit() {
    if ('ondeviceorientation' in this.winRef.nativeWindow) {
      this.deviceEnabled = ' ondeviceorientation is enabled';
      this.winRef.nativeWindow.addEventListener('deviceorientation', function(event) {
        let coords =  {
          zumoId: 1,
          alpha: Math.round(event.alpha),
          gamma: this.convertForArduino(Math.round(event.gamma)),
          beta: this.convertForArduino(Math.round(event.beta)),
        };
        this.alpha = Math.round(event.alpha);
        this.gamma = Math.round(event.gamma);
        this.beta = Math.round(event.beta);
        if (this.initialCoords.gamma != coords.gamma || this.initialCoords.beta != coords.beta) { /* Persist to DB if updated */
          this.initialCoords.gamma = coords.gamma;
          this.initialCoords.beta = coords.beta;
          this.updateCoordsInDB(coords);
        }
        this.updateDebugText(); /* Log actions */
     }.bind(this), true);
    } else {
      this.deviceEnabled = 'ondeviceorientation NOT enabled';
    }
  }

  updateDebugText = () => {
    let terms = [];
    if (this.convertForArduino(+this.gamma) > 0) {
      terms.push('Turning Right');
    } else if (this.convertForArduino(+this.gamma) < 0) {
      terms.push('Turning Left')
    } else if (this.convertForArduino(+this.beta) > 0) {
      terms.push('Reversing');
    } else if (this.convertForArduino(+this.beta) < 0) {
      terms.push('Going forward');
    }
    if (terms.length === 0) {
      terms.push('Zumo is Stationary');
    }
    terms.push(`[${this.gamma},${this.beta}]`)
    this.debug = terms.join(', ');
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
    });
  }

  updateSongInDB = (song: any) => {
    this.http.post(this.url + '/api/songs', song).subscribe(data => {}, err => {
      this.debug = err.message;
    });
  }

}
