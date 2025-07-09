import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { SidebarComponent } from './components/sidebar/sidebar.component';
import { ContactsComponent } from './components/contacts/contacts.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContactFormComponent } from './components/contact-form/contact-form.component';
import { provideHttpClient } from '@angular/common/http';
import { NgxMaskDirective,provideNgxMask } from 'ngx-mask';
import { RouterModule } from '@angular/router';
import { MaskPipe } from './pipes/mask.pipe';
import { NgxPaginationModule } from 'ngx-pagination';

@NgModule({
  declarations: [
    AppComponent,
    SidebarComponent,
    ContactsComponent,
    NavbarComponent,
    ContactFormComponent,
    MaskPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    ReactiveFormsModule,
    FormsModule,
    NgxMaskDirective,
    RouterModule,
    NgxPaginationModule
  ],
  exports: [
    MaskPipe
  ],
  providers: [provideHttpClient(), provideNgxMask()],
  bootstrap: [AppComponent],
})
export class AppModule {}
