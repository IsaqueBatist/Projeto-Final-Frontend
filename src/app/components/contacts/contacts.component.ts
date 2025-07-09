import { Component, OnInit } from '@angular/core';
import { Contact } from '../../models/Contact';
import { ContactService } from '../../services/contact.service';
import { SearchServiceService } from '../../services/search-service.service';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(
    private contactService: ContactService,
    private searchService: SearchServiceService
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

  filterFavorite(isFavorite: boolean) {
    this.searchService.SearchFavorites(isFavorite);
  }

  getInitials(firstname: string, lastname: string): string {
    return `${firstname?.charAt(0) || ''}${
      lastname?.charAt(0) || ''
    }`.toUpperCase();
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
