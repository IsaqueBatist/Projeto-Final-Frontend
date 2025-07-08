import { Component, OnInit, TemplateRef } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { Category } from '../../models/Category';
import { Group } from '../../models/Group';
import { SearchServiceService } from '../../services/search-service.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ContactService } from '../../services/contact.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-contact-form',
  standalone: false,
  templateUrl: './contact-form.component.html',
  styleUrl: './contact-form.component.css',
})
export class ContactFormComponent implements OnInit{
  contactForm: FormGroup;
  selectedCategories: Category[] = [];
  selectedGroups: Group[] = [];
  newCategory = '';
  newGroup = '';
  selectedGroup: string = '';
  selectedCategory: string = ''
  
  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private contactService: ContactService,
    private groupService: GroupService,
    private modalService: NgbModal,
    private router: Router,
    private activedRoute: ActivatedRoute
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
    let contactId =  Number(this.activedRoute.snapshot.paramMap.get('id'));
    if (contactId !=0) {
      this.setContactById(contactId);
    }
    this.getCategoriesData()
    this.getGroupData()
  }

  setContactById(id: number) {
    this.contactService.getContactById(id).subscribe({
      next: (contact) => {
        this.contactForm.patchValue({
          id: contact.id,
          firstname: contact.firstname,
          lastname: contact.lastname,
          birthDate: contact.birthDate,
          isFavorite: contact.isFavorite,
          note: contact.note
        });
  
        // Endereços
        this.addresses.clear();
        contact.addresses.forEach((address) => {
          this.addresses.push(
            this.fb.group({
              id: [address.id],
              number: [address.number || ''],
              complement: [address.complement || ''],
              neighborhood: [address.neighborhood || ''],
              city: [address.city || ''],
              state: [address.state || ''],
              country: [address.country || ''],
              postalCode: [address.postalCode || '']
            })
          );
        });
  
        // Telefones
        this.phones.clear();
        contact.phones.forEach((phone) => {
          this.phones.push(
            this.fb.group({
              id: [phone.id],
              label: [phone.label || ''],
              phoneNumber: [phone.phoneNumber || '', Validators.required]
            })
          );
        });
  
        // Emails
        this.emails.clear();
        contact.emails.forEach((email) => {
          this.emails.push(
            this.fb.group({
              id: [email.id],
              label: [email.label || ''],
              email: [email.email || '', [Validators.required, Validators.email]]
            })
          );
        });
  
        // Categorias
        this.categories.clear();
        contact.categories.forEach((category) => {
          this.categories.push(
            this.fb.group({
              id: [category.id],
              name: [category.name]
            })
          );
        });
  
        // Grupos
        this.groups.clear();
        contact.groups.forEach((group) => {
          this.groups.push(
            this.fb.group({
              id: [group.id],
              name: [group.name]
            })
          );
        });
      },
      error: (err) => { 
        console.error('Erro ao buscar contato:', err);
      }
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
      type: ['personal'],
    });
  }

  createPhoneField(): FormGroup {
    return this.fb.group({
      number: ['', Validators.required],
      type: ['mobile'],
    });
  }

  createAddressField(): FormGroup {
    return this.fb.group({
      street: [''],
      city: [''],
      state: [''],
      zipCode: [''],
      country: [''],
      type: ['home'],
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
    this.selectedCategories.splice(index, 1);
  }


  removeGroup(index: number): void {
    this.selectedGroups.splice(index, 1);
  }

  isCategorySelected(cat: any) {
  return this.contactForm.get('categories')?.value?.some((c: any) => c.id === cat.id);
}

isGroupSelected(grp: any) {
  return this.contactForm.get('groups')?.value?.some((g: any) => g.id === grp.id);
}

openModal(templateRef: TemplateRef<any>) {
  this.modalService.open(templateRef, { centered: true, size: 'sm' });
}

addCategory(modal: any) {
  const categories = this.contactForm.get('categories')?.value || [];
  if (this.selectedCategory && !this.isCategorySelected(this.selectedCategory)) {
    categories.push(this.selectedCategory);
    this.contactForm.get('categories')?.setValue(categories);
  }
  this.selectedCategory = '';
  modal.close();
}

addGroup(modal: any) {
  const groups = this.contactForm.get('groups')?.value || [];
  if (this.selectedGroup && !this.isGroupSelected(this.selectedGroup)) {
    groups.push(this.selectedGroup);
    this.contactForm.get('groups')?.setValue(groups);
  }
  this.selectedGroup = '';
  modal.close();
}

  onSubmit(): void {
      if(this.contactForm.valid){
        const contact = this.contactForm.value;
        console.log(this.contactForm.value)
        this.contactService.createContact(contact).subscribe(() => this.router.navigate(['']))
      }
  }
}
