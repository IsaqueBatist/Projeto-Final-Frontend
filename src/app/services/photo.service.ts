import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Photo } from '../models/Photo';

@Injectable({
  providedIn: 'root',
})
export class PhotoService {
  private apiUrl = 'localhost:8080/photos';

  constructor(private http: HttpClient) {}

  getPhotos(): Observable<Photo[]> {
    return this.http.get<Photo[]>(this.apiUrl);
  }
}
