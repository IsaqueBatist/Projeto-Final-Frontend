import { Component, OnInit, TemplateRef } from '@angular/core';
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
  constructor(
    private modalService: NgbModal,
    private categoryService: CategoryService,
    private groupService: GroupService,
    private searchService: SearchServiceService
  ) {}

  newCategoryName: string = '';
  newGroupName: string = '';
  categories: Category[] = [];
  groups: Group[] = [];
  isEditing: boolean = false;
  newCategoryObj: Category = {} as Category;
  newGroupObj: Group = {} as Group;

  resetData() {
    this.isEditing = false;
    this.newCategoryObj = {} as Category;
    this.newGroupObj = {} as Group;
    this.newCategoryName = '';
    this.newGroupName = '';
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

  saveCategory(modal: NgbActiveModal) {
    if (!this.newCategoryName) return;

    if (!this.isEditing) {
      this.categoryService
        .postCategory({ name: this.newCategoryName })
        .subscribe(() => modal.close());
    } else {
      this.categoryService
        .updateCategory(this.newCategoryObj)
        .subscribe(() => this.getCategoriesData());
    }
  }

  saveGroup(modal: NgbActiveModal) {
    if (!this.newGroupName) return;

    if (!this.isEditing) {
      this.groupService
        .postGroup({ name: this.newGroupName })
        .subscribe(() => modal.close());
    } else {
      this.groupService
        .updateGroup(this.newCategoryObj)
        .subscribe(() => this.getGroupData());
    }
  }

  openCategoryModal(templateRef: TemplateRef<any>, id?: number) {
    console.log();
    const modalRef = this.modalService.open(templateRef, {
      centered: true,
      size: 'sm',
    });
    if (id) {
      this.categoryService.getCategoryById(id).subscribe((data) => {
        this.newCategoryObj = data;
        this.isEditing = true;
      });
    }

    modalRef.result.finally(() => {
      this.resetData();
    });
  }

  openGroupModal(templateRef: TemplateRef<any>, id?: number) {
    const modalRef = this.modalService.open(templateRef, {
      centered: true,
      size: 'sm',
    });
    if (id) {
      this.groupService.getGroupById(id).subscribe((data) => {
        this.newGroupObj = data;
        this.isEditing = true;
      });
    }

    modalRef.result.finally(() => {
      this.resetData();
    });
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
