import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { Category } from '../../models/Category';
import { Group } from '../../models/Group';
import { SearchServiceService } from '../../services/search-service.service';

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

  constructor(
    private fb: FormBuilder,
    private categoryService: CategoryService,
    private groupService: GroupService
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
      photo: [''],
    });
  }
  ngOnInit(): void {


    this.getCategoriesData()
    this.getGroupData()
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

  addCategory(): void {
    if (this.newCategory.trim()) {
      this.selectedCategories.push({
        id: Date.now(), // ID temporário
        name: this.newCategory.trim(),
      });
      this.newCategory = '';
    }
  }

  removeCategory(index: number): void {
    this.selectedCategories.splice(index, 1);
  }

  addGroup(): void {
    if (this.newGroup.trim()) {
      this.selectedGroups.push({
        id: Date.now(), // ID temporário
        name: this.newGroup.trim(),
      });
      this.newGroup = '';
    }
  }

  removeGroup(index: number): void {
    this.selectedGroups.splice(index, 1);
  }

  onSubmit(): void {
      console.log(this.contactForm.value);
      // Salvar contato
  }
}
