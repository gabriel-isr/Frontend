import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ImagesStorageService {

  private baseUrl = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  uploadImage(file: File, duration: string): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    formData.append('image', file);
    formData.append('duration', duration);

    const req = new HttpRequest('POST', `${this.baseUrl}/uploadImage`, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  addImageUrl(imageUrl: string,duration: string): Observable<HttpEvent<any>> {

    const formData: FormData = new FormData();

    formData.append('imageurl', imageUrl);
    formData.append('duration', duration);

    const req = new HttpRequest('POST', `${this.baseUrl}/addImage`, formData, {
      responseType: 'json'
    });

    return this.http.request(req);
  }

  getFiles(): Observable<any> {
    return this.http.get(`${this.baseUrl}/images`);
  }

  deleteImage(id: String): Observable<any> {
    return this.http.delete(`${this.baseUrl}/deleteImage/${id}`);
  }
}