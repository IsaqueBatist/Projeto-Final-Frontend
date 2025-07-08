import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Category, CategoryData } from '../../models/Category';
import { Group } from '../../models/Group';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchServiceService } from '../../services/search-service.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
  @ViewChild('modalCreateCategory') modalCreateCategory: any;
  @ViewChild('modalCreateGroup') modalCreateGroup: any;

  newCategoryName = '';
  newGroupName = '';

  editingCategory = false;
  editingGroup = false;
  currentCategoryId: number | null = null;
  currentGroupId: number | null = null;

  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private groupService: GroupService,
    private searchService: SearchServiceService
  ) {}


  categories: Category[] = [];
  groups: Group[] = [];
  isEditing: boolean = false;
  isGroup: boolean = false;

  resetData() {
    this.isEditing = false;
    this.isGroup = false;
    this.newCategoryName = '';
    this.newGroupName = '';
    this.getCategoriesData()
  }

  ngOnInit(): void {
    this.getCategoriesData();
    this.getGroupData();
  }

  getCategoriesData() {
    this.categoryService
      .getCategories()
      .subscribe((data) => (this.categories = data));
  }

  getGroupData() {
    this.groupService.getGroupies().subscribe((data) => (this.groups = data));
  }

  deleteGroup(id: number) {
    this.groupService.deleteGroup(id).subscribe(() => this.getGroupData());
  }

  deleteCategory(id: number) {
    this.categoryService
      .deleteCategory(id)
      .subscribe(() => this.getCategoriesData());
  }

  // saveCategory(modal: NgbActiveModal) {
  //   if (!this.newCategoryName) return;

  //   if (!this.isEditingCategory) {
  //     this.categoryService
  //       .postCategory({ name: this.newCategoryName })
  //       .subscribe(() => modal.close());
  //   } else {
  //     this.categoryService
  //       .updateCategory(this.newCategoryObj)
  //       .subscribe(() => this.getCategoriesData());
  //   }
  // }

  // saveGroup(modal: NgbActiveModal) {
  //   if (!this.newGroupName) return;

  //   if (!this.isEditingGroup) {
  //     this.groupService
  //       .postGroup({ name: this.newGroupName })
  //       .subscribe(() => modal.close());
  //   } else {
  //     this.groupService
  //       .updateGroup(this.newGroupObj)
  //       .subscribe(() => this.getGroupData());
  //   }
  // }

  // openCategoryModal(templateRef: TemplateRef<any>, id?: number) {
  //   console.log();
  //   const modalRef = this.modalService.open(templateRef, {
  //     centered: true,
  //     size: 'sm',
  //   });
  //   if (id) {
  //     this.categoryService.getCategoryById(id).subscribe((data) => {
  //       this.newCategoryObj = data;
  //       this.newCategoryName= data.name
  //       this.isEditingCategory = true;
  //     });
  //   }

  //   modalRef.result.finally(() => {
  //     this.resetData();
  //   });
  // }

  // openGroupModal(templateRef: TemplateRef<any>, id?: number) {
  //   const modalRef = this.modalService.open(templateRef, {
  //     centered: true,
  //     size: 'sm',
  //   });
  //   if (id) {
  //     this.groupService.getGroupById(id).subscribe((data) => {
  //       this.newGroupObj = data;
  //       this.newGroupName = data.name
  //       this.isEditingGroup = true;
  //     });
  //   }

  //   modalRef.result.finally(() => {
  //     this.resetData();
  //   });
  // }
  openCategoryModal(category?: Category): void {
    this.editingCategory = !!category;
    this.currentCategoryId = category?.id || null;
    this.newCategoryName = category?.name || '';

    this.modalService.open(this.modalCreateCategory);
  }

  // Abrir modal de grupo (novo ou edição)
  openGroupModal(group?: Group): void {
    this.editingGroup = !!group;
    this.currentGroupId = group?.id || null;
    this.newGroupName = group?.name || '';

    this.modalService.open(this.modalCreateGroup);
  }

  // Salvar ou editar categoria
  saveCategory(modal: NgbActiveModal): void {
    if (this.editingCategory && this.currentCategoryId !== null) {
      this.categoryService.postCategory({id: this.currentCategoryId, name: this.newCategoryName}).subscribe(() => modal.close())
    } else {
      // Lógica para criar nova categoria
      console.log('Criando nova categoria:', this.newCategoryName);
    }

    modal.close();
    this.resetCategoryForm();
  }

  // Salvar ou editar grupo
  saveGroup(modal: any): void {
    if (this.editingGroup && this.currentGroupId !== null) {
      // Lógica para editar grupo
      console.log('Editando grupo:', this.currentGroupId, this.newGroupName);
    } else {
      // Lógica para criar novo grupo
      console.log('Criando novo grupo:', this.newGroupName);
    }

    modal.close();
    this.resetGroupForm();
  }

  // Limpar dados após fechamento
  resetCategoryForm(): void {
    this.newCategoryName = '';
    this.editingCategory = false;
    this.currentCategoryId = null;
  }

  resetGroupForm(): void {
    this.newGroupName = '';
    this.editingGroup = false;
    this.currentGroupId = null;
  }
  
  //pesquisas
  onSelectCategory(category: Category) {
    const categoryName = category ? category.name : null;
    this.searchService.setSelectedCategory(categoryName);
  }
  onSelectGroup(group: Group) {
    const categoryName = group ? group.name : null;
    this.searchService.setSelectedGroup(categoryName);
  }
}
