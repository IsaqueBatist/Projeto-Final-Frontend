import { Component, OnInit, TemplateRef } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../models/Category';
import { Group } from '../../models/Group';
import { CategoryService } from '../../services/category.service';
import { ContactService } from '../../services/contact.service';
import { GroupService } from '../../services/group.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-contact-form',
  standalone: false,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent implements OnInit {
  contactForm: FormGroup;
  selectedCategories: Category[] = [];
  selectedGroups: Group[] = [];
  selectedGroup: Group = {} as Group;
  selectedCategory: Category = {} as Category;
  contactId: number = 0;

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private groupService: GroupService,
    private modalService: NgbModal,
    private router: Router,
    private activedRoute: ActivatedRoute,
    private sharedDataService: SharedDataService
  ) {
    this.contactForm = this.fb.group({
      firstname: ['', Validators.required],
      lastname: ['', Validators.required],
      birthDate: [''],
      isFavorite: [false],
      emails: this.fb.array([this.createEmailField()]),
      phones: this.fb.array([this.createPhoneField()]),
      addresses: this.fb.array([this.createAddressField()]),
      groups: this.fb.array([]),
      categories: this.fb.array([]),
      note: [''],
    });
  }
  ngOnInit(): void {
    this.contactId = Number(this.activedRoute.snapshot.paramMap.get('id'));
    if (this.contactId != 0) {
      this.setContactById(this.contactId);
    }
    this.getCategoriesData();
    this.getGroupData();

    //Categorie and Groups litener
    this.sharedDataService.categories$.subscribe((cats) => {
      this.selectedCategories = cats;
    });

    this.sharedDataService.groups$.subscribe((grps) => {
      this.selectedGroups = grps;
    });

  }

  setContactById(id: number) {
    this.contactService.getContactById(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue({
          firstname: contact.firstname,
          lastname: contact.lastname,
          birthDate: contact.birthDate,
          isFavorite: contact.isFavorite,
          note: contact.note,
        });

        // Endereços
        this.addresses.clear();
        contact.addresses.forEach((address) => {
          console.log(address);
          this.addresses.push(
            this.fb.group({
              id: [address.id || ''],
              street: [address.street || ''],
              number: [address.number || ''],
              complement: [address.complement || ''],
              neighborhood: [address.neighborhood || ''],
              city: [address.city || ''],
              state: [address.state || ''],
              country: [address.country || ''],
              postalCode: [address.postalCode || ''],
            })
          );
        });

        // Telefones
        this.phones.clear();
        contact.phones.forEach((phone) => {
          this.phones.push(
            this.fb.group({
              id: [phone.id || ''],
              label: [phone.label || ''],
              phoneNumber: [phone.phoneNumber || '', Validators.required],
            })
          );
        });

        // Emails
        this.emails.clear();
        contact.emails.forEach((email) => {
          this.emails.push(
            this.fb.group({
              id: [email.id || ''],
              label: [email.label || ''],
              email: [
                email.email || '',
                [Validators.required, Validators.email],
              ],
            })
          );
        });

        // Categorias
        this.categories.clear();
        contact.categories.forEach((category) => {
          this.categories.push(
            this.fb.group({
              id: [category.id || ''],
              name: [category.name],
            })
          );
        });

        // Grupos
        this.groups.clear();
        contact.groups.forEach((group) => {
          this.groups.push(
            this.fb.group({
              id: [group.id || ''],
              name: [group.name],
            })
          );
        });
      },
      error: (err) => {
        console.error('Erro ao buscar contato:', err);
      },
    });
  }

  getCategoriesData() {
    this.categoryService
      .getCategories()
      .subscribe((data) => (this.selectedCategories = data));
  }

  getGroupData() {
    this.groupService
      .getGroupies()
      .subscribe((data) => (this.selectedGroups = data));
  }

  // Métodos para criar campos dinâmicos
  createEmailField(): FormGroup {
    return this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      label: [''],
    });
  }

  createPhoneField(): FormGroup {
    return this.fb.group({
      phoneNumber: ['', Validators.required],
      label: [''],
    });
  }

  createAddressField(): FormGroup {
    return this.fb.group({
      number: [''],
      complement: [''],
      street: [''],
      city: [''],
      state: [''],
      postalCode: [''],
      country: [''],
      neighborhood: [''],
    });
  }

  // Getters para os FormArrays
  get emails(): FormArray {
    return this.contactForm.get('emails') as FormArray;
  }

  get phones(): FormArray {
    return this.contactForm.get('phones') as FormArray;
  }

  get addresses(): FormArray {
    return this.contactForm.get('addresses') as FormArray;
  }

  get groups(): FormArray {
    return this.contactForm.get('groups') as FormArray;
  }

  get categories(): FormArray {
    return this.contactForm.get('categories') as FormArray;
  }

  // Métodos para adicionar/remover campos
  addEmail(): void {
    this.emails.push(this.createEmailField());
  }

  removeEmail(index: number): void {
    this.emails.removeAt(index);
  }

  addPhone(): void {
    this.phones.push(this.createPhoneField());
  }

  removePhone(index: number): void {
    this.phones.removeAt(index);
  }

  addAddress(): void {
    this.addresses.push(this.createAddressField());
  }

  removeAddress(index: number): void {
    this.addresses.removeAt(index);
  }

  removeCategory(index: number): void {
    this.categories.removeAt(index);
  }

  removeGroup(index: number): void {
    this.groups.removeAt(index);
  }

  isCategorySelected(cat: Category) {
    return this.contactForm
      .get('categories')
      ?.value?.some((c: Category) => c.id === cat.id);
  }

  isGroupSelected(grp: Group) {
    return this.contactForm
      .get('groups')
      ?.value?.some((g: Group) => g.id === grp.id);
  }

  openModal(templateRef: TemplateRef<any>) {
    this.modalService.open(templateRef, { centered: true, size: 'sm' });
  }

  addCategory(modal: NgbActiveModal) {
    const categoriesArray = this.contactForm.get('categories') as FormArray;
    if (
      this.selectedCategory &&
      !this.isCategorySelected(this.selectedCategory)
    ) {
      categoriesArray.push(new FormControl(this.selectedCategory));
      this.selectedCategory = {} as Category;
      modal.close();
    }
  }

  addGroup(modal: NgbActiveModal) {
    const groupsArray = this.contactForm.get('groups') as FormArray;
    if (this.selectedGroup && !this.isGroupSelected(this.selectedGroup)) {
      groupsArray.push(new FormControl(this.selectedGroup));
      this.selectedGroup = {} as Group;
      modal.close();
    }
  }

  onSaveContact() {
    if (this.contactForm.valid) {
      console.log(this.contactForm.value);
      this.contactService
        .updateContact(this.contactId, this.contactForm.value)
        .subscribe(() => this.router.navigate(['']));
    }
  }

  onCeateContact(): void {
    if (this.contactForm.valid) {
      const contact = this.contactForm.value;
      console.log(this.contactForm.value);
      this.contactService
        .createContact(contact)
        .subscribe(() => this.router.navigate(['']));
    }
  }
}
