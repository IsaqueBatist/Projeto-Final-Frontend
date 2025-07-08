import { Component, OnInit } from '@angular/core';
import { ContactService } from '../../services/contact.service';
import { Contact } from '../../models/Contact';

@Component({
  selector: 'app-contacts',
  standalone: false,
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.css',
})
export class ContactsComponent implements OnInit {
  contacts: Contact[] = [];

  constructor(private contactService: ContactService) {}

  ngOnInit(): void {
    this.getContactData();
  }

  getInitials(firstname: string, lastname: string): string {
  return `${firstname?.charAt(0) || ''}${lastname?.charAt(0) || ''}`.toUpperCase();
}

  getContactData() {
    this.contactService
      .getContacts()
      .subscribe((data) => (this.contacts = data));
  }

  deleteContact(id: number){
    console.log('deleta')
    this.contactService.deleteContact(id).subscribe(() => this.getContactData)
  }
}
