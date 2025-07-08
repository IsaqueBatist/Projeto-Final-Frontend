import { Component, OnInit, TemplateRef } from '@angular/core';
import { Category, CategoryData } from '../../models/Category';
import { Group } from '../../models/Group';
import { CategoryService } from '../../services/category.service';
import { GroupService } from '../../services/group.service';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private groupService: GroupService
  ) {}

  newCategoryName: string = '';
  newGroupName: string = '';
  categories: Category[] = [];
  groups: Group[] = [];

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
  //FAZER EDITAR
  createCategory(modal: NgbActiveModal) {
    if (!this.newCategoryName) return;

    this.categoryService
      .postCategory({ name: this.newCategoryName })
      .subscribe({
        next: () => {
          this.getCategoriesData();
          this.newCategoryName = '';
          modal.close();
        },
      });
  }

  createGroup(modal: NgbActiveModal) {
    if (!this.newGroupName) return;

    this.groupService.postGroup({ name: this.newGroupName }).subscribe({
      next: () => {
        this.getGroupData();
        this.newGroupName = '';
        modal.close();
      },
    });
  }

  editCategory(modal: NgbActiveModal) {}

  openModal(templateRef: TemplateRef<any>, id?: number) {
    const modalRef = this.modalService.open(templateRef, {
      centered: true,
      size: 'sm',
    });
  }
}
