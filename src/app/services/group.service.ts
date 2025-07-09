import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Group, GroupData } from '../models/Group';

@Injectable({
  providedIn: 'root',
})
export class GroupService {
  private apiUrl = 'https://gerenciadorcontato.duckdns.org/contacts/groups';

  constructor(private http: HttpClient) {}

  getGroupies(): Observable<Group[]> {
    return this.http.get<Group[]>(this.apiUrl);
  }

  getGroupById(id: number): Observable<Group> {
    return this.http.get<Group>(`${this.apiUrl}/${id}`);
  }

  postGroup(group: GroupData): Observable<Group> {
    return this.http.post<Group>(this.apiUrl, group);
  }

  deleteGroup(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  updateGroup(group: Group): Observable<Group> {
    return this.http.put<Group>(`${this.apiUrl}/${group.id}`, group);
  }
}
