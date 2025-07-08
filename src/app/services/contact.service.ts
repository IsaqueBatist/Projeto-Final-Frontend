import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from '../models/Contact';

@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private apiUrl = 'http://3.95.24.238/contacts';

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

  // PATCH
  patchContact(id: number, fields: Partial<Contact>): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}`, fields);
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
