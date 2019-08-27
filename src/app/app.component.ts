import { Component } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(private http: HttpClient) {
    this.http.get('/api/songs').subscribe(data => {
      console.log(data);
    }, err => {
      console.log(`Error occured: ${err.message}`);
    });
  }
}
