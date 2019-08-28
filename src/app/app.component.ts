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

    this.winRef.nativeWindow.addEventListener('click', function() {
      this.debug += '+';
    }.bind(this), true);

    if ('ondeviceorientation' in this.winRef.nativeWindow) {
      this.debug += ' ondeviceorientation enabled ';
      this.winRef.nativeWindow.addEventListener('deviceorientation', function(event) {
        this.alpha = Math.round(event.alpha);
        this.gamma = Math.round(event.gamma);
        this.beta = Math.round(event.beta);
     }.bind(this), true);
    } else {
      this.debug += ' ondeviceorientation NOT enabled ';
    }
    if ('ondevicemotion' in this.winRef.nativeWindow) {
      this.debug += ' ondevicemotion enabled ';
      this.winRef.nativeWindow.addEventListener('devicemotion', function(event) {
        // this.debug += '|';
      }.bind(this), true);
    } else {
      this.debug += ' ondevicemotion NOT enabled ';
    }
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
