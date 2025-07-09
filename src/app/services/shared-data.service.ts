import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Category } from '../models/Category';
import { Group } from '../models/Group';

@Injectable({
  providedIn: 'root'
})
export class SharedDataService {
  private categoriesSubject = new BehaviorSubject<Category[]>([]);
  private groupsSubject = new BehaviorSubject<Group[]>([]);

  categories$ = this.categoriesSubject.asObservable();
  groups$ = this.groupsSubject.asObservable();

  updateCategories(newCategories: Category[]) {
    this.categoriesSubject.next(newCategories);
  }

  updateGroups(newGroups: Group[]) {
    this.groupsSubject.next(newGroups);
  }
}
