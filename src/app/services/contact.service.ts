import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Contact } from '../models/Contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://localhost:8080/contacts';

  constructor(private http: HttpClient) {}

  // GET
  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  // GET:
  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  // POST
  createContact(Contact: Contact): Observable<Contact> {
    return this.http.post<Contact>(this.apiUrl, Contact);
  }

  // PUT
  updateContact(id: number, contact: Contact): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, contact);
  }

  searchByFavorites(isFavorite: boolean): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/search/by-favorite`, {
      params: new HttpParams().set('favorite', isFavorite),
    });
  }

  // DELETE
  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByPartialName(name: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/search/by-name`, {
      params: new HttpParams().set('name', name),
    });
  }

  searchByCategory(categoryName: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/search/by-category`, {
      params: new HttpParams().set('categoryName', categoryName),
    });
  }

  searchByGroup(groupName: string): Observable<Contact[]> {
    return this.http.get<Contact[]>(`${this.apiUrl}/search/by-group`, {
      params: new HttpParams().set('groupName', groupName),
    });
  }
}
