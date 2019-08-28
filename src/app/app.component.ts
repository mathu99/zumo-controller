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
          gamma: Math.round(event.gamma),
          beta: Math.round(event.beta),
        };
        this.alpha = Math.round(event.alpha);
        this.gamma = Math.round(event.gamma);
        this.beta = Math.round(event.beta);
        this.updateCoordsInDB(coords);
     }.bind(this), true);
    } else {
      this.debug += ' ondeviceorientation NOT enabled';
    }
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
