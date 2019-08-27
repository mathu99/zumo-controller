import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  songs: any[] = [];
  constructor(private http: HttpClient) {
    // this.http.get('http://localhost:3000/api/songs').subscribe(data => {
    this.http.get('/api/songs').subscribe(data => {
      this.songs = <any> data;
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });
  }

  select = (song: any) => {
    this.songs.map(e => (e._id === song._id) ? e.selected = !e.selected : false);
  }
}
