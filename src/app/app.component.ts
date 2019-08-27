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
  x = 0;
  y = 0;
  z = 0;

  constructor(private http: HttpClient, private winRef: WindowRef) {
    this.http.get(this.url + '/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });

    winRef.nativeWindow.ondevicemotion = function(event) {
      this.x = event.accelerationIncludingGravity.x;
      this.y = event.accelerationIncludingGravity.y;
      this.z = event.accelerationIncludingGravity.z;
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
