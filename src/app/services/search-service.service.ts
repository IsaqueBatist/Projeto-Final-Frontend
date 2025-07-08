import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SearchServiceService {
  private searchTermSubject = new BehaviorSubject<string>('');
  searchTerm$ = this.searchTermSubject.asObservable();

  private selectedCategory = new BehaviorSubject<string | null>(null);
  selectedCategory$ = this.selectedCategory.asObservable();

  private selectedGroup = new BehaviorSubject<string | null>(null);
  selectedGroup$ = this.selectedGroup.asObservable();

  setSearchTerm(term: string) {
    this.searchTermSubject.next(term);
  }

  setSelectedCategory(name: string | null){
    this.selectedCategory.next(name)
  }

  setSelectedGroup(name: string | null){
    this.selectedGroup.next(name)
  }
}
