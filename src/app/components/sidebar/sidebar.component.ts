import { Component, OnInit, TemplateRef } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Category } from '../../models/Category';
import { Group } from '../../models/Group';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { SearchServiceService } from '../../services/search-service.service';
import { SharedDataService } from '../../services/shared-data.service';

@Component({
  selector: 'app-sidebar',
  standalone: false,
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.css',
})
export class SidebarComponent implements OnInit {
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
    private searchService: SearchServiceService,
    private sharedDataService: SharedDataService
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
    this.getCategoriesData();
  }

  ngOnInit(): void {
    this.getCategoriesData();
    this.getGroupData();
  }

  getCategoriesData() {
    this.categoryService
      .getCategories()
      .subscribe((data) => (
        this.categories = data,
        this.sharedDataService.updateCategories(data)
      ));
  }

  getGroupData() {
    this.groupService.getGroupies().subscribe((data) => {
      this.groups = data
      this.sharedDataService.updateGroups(data)
    });
  }

  deleteGroup(id: number) {
    this.groupService.deleteGroup(id).subscribe(() => this.getGroupData());
  }

  deleteCategory(id: number) {
    this.categoryService
      .deleteCategory(id)
      .subscribe(() => this.getCategoriesData());
  }

  openCategoryModal(templateRef: TemplateRef<any>, category?: Category): void {
    this.editingCategory = !!category;
    this.currentCategoryId = category?.id || null;
    this.newCategoryName = category?.name || '';

    this.modalService.open(templateRef, {
      centered: true,
      size: 'sm',
    });
  }

  // Abrir modal de grupo (novo ou edição)
  openGroupModal(templateRef: TemplateRef<any>, group?: Group): void {
    this.editingGroup = !!group;
    this.currentGroupId = group?.id || null;
    this.newGroupName = group?.name || '';

    this.modalService.open(templateRef, {
      centered: true,
      size: 'sm',
    });
  }

  validFieldName(term: string): boolean {
    if (term.trim() === '') return false;
    return true;
  }

  // Salvar ou editar categoria
  saveCategory(modal: NgbActiveModal): void {
    if (!this.validFieldName(this.newCategoryName)) return;
    if (this.editingCategory && this.currentCategoryId !== null) {
      //Editar
      this.categoryService
        .updateCategory({
          id: this.currentCategoryId,
          name: this.newCategoryName,
        })
        .subscribe(() => {
          this.getCategoriesData();
          modal.close();
        });
    } else {
      // Criar
      this.categoryService
        .postCategory({ name: this.newCategoryName })
        .subscribe(() => {
          this.getCategoriesData(), modal.close();
        });
    }

    modal.close();
    this.resetCategoryForm();
  }

  // Salvar ou editar grupo
  saveGroup(modal: NgbActiveModal): void {
    if (!this.validFieldName(this.newGroupName)) return;

    if (this.editingGroup && this.currentGroupId !== null) {
      //Editar
      this.groupService
        .updateGroup({ id: this.currentGroupId, name: this.newGroupName })
        .subscribe(() => {
          this.getGroupData(), modal.close();
        });
    } else {
      //Crar
      this.groupService
        .postGroup({
          name: this.newGroupName,
        })
        .subscribe(() => {
          this.getGroupData();
          modal.close();
        });
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

  //pesquisa
  onSelectContacts() {
    this.searchService.setSelectedCategory(null);
    this.searchService.setSelectedGroup(null);
  }
}
