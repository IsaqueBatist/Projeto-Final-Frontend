import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/Contact';
import { ContactService } from '../../services/contact.service';
import { SearchServiceService } from '../../services/search-service.service';
import { Category } from '../../models/Category';
import { Group } from '../../models/Group';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { CommonModule } from '@angular/common';
import { MaskPipe } from '../../pipes/mask.pipe';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];
  isFavorite: boolean = false;
  categories: Category[] = [];
  groups: Group[] = [];

  constructor(
    private contactService: ContactService,
    private searchService: SearchServiceService,
    private categoryService: CategoryService,
    private groupService: GroupService
  ) {}

  ngOnInit(): void {
    //Barra de pesquisa
    this.searchService.searchTerm$.subscribe((term) => {
      this.contactService
        .searchByPartialName(term)
        .subscribe((data) => (this.contacts = data));
    });

    this.searchService.favorites$.subscribe((favorite) => {
      this.contactService
        .searchByFavorites(favorite)
        .subscribe((data) => (this.contacts = data));
    });

    //Grupos
    this.searchService.selectedGroup$.subscribe((groupName) => {
      if (groupName) {
        this.contactService
          .searchByGroup(groupName || '')
          .subscribe((data) => (this.contacts = data));
      } else {
        this.getContactData();
      }
    });

    //Category
    this.searchService.selectedCategory$.subscribe((categoryName) => {
      if (categoryName) {
        this.contactService
          .searchByCategory(categoryName || '')
          .subscribe((data) => (this.contacts = data));
      } else {
        this.getContactData();
      }
    });

    //Load data
    this.getCategoriesData();
    this.getGroupData();
  }

  onFilterChange(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value;
    if (valor === 'favoritos') {
      this.filterFavorite(true);
    } else {
      this.getContactData();
    }
  }

  getCategoriesData() {
    this.categoryService
      .getCategories()
      .subscribe((data) => (this.categories = data));
  }

  getGroupData() {
    this.groupService.getGroupies().subscribe((data) => (this.groups = data));
  }

  //Filters
  onFilterFavorite() {
    this.searchService.searchFavorites(this.isFavorite);
    this.isFavorite = !this.isFavorite;
  }
  onFilterGroup(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value == 'null' ? null : input.value;

    this.searchService.setSelectedGroup(valor);
  }
  onFilterCategory(event: Event) {
    const input = event.target as HTMLInputElement;
    const valor = input.value == 'null' ? null : input.value;

    this.searchService.setSelectedCategory(valor);
  }

  filterFavorite(isFavorite: boolean) {
    this.searchService.searchFavorites(isFavorite);
  }

  search(event: Event) {
    const input = event.target as HTMLInputElement;
    this.searchService.setSearchTerm(input.value);
  }
  //Caso não selecione imagem (Implementação futura)
  getInitials(firstname: string, lastname: string): string {
    return `${firstname?.charAt(0)}${lastname?.charAt(0)}`.toUpperCase();
  }

  getContactData() {
    this.contactService
      .getContacts()
      .subscribe((data) => (this.contacts = data));
  }

  deleteContact(id: number) {
    this.contactService
      .deleteContact(id)
      .subscribe(() => this.getContactData());
  }
}
