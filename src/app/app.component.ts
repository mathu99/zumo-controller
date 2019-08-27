import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  songs: any[] = [];
  // url: string = 'http://localhost:3000';
  url: string = '';
  constructor(private http: HttpClient) {
    this.http.get(this.url + '/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });
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
