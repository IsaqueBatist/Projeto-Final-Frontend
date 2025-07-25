import { Component, EventEmitter, Output } from '@angular/core';
import { SearchServiceService } from '../../services/search-service.service';

@Component({
  selector: 'app-navbar',
  standalone: false,
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  @Output() setToggle = new EventEmitter<void>();

  onToggleSidebar() {
    this.setToggle.emit();
  }
}
