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

  constructor(private http: HttpClient, private winRef: WindowRef) {
    this.http.get(this.url + '/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });

    winRef.nativeWindow.addEventListener("devicemotion", this.handleOrientation);
  }

  handleOrientation = (event) => {
    this.x = event.acceleration.x;
    this.y = event.acceleration.y;
    this.z = event.acceleration.z;
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
