import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './navbar/navbar.component';
import { RouterModule } from '@angular/router';
import { NotificationModalComponent } from './notification-modal/notification-modal.component';

@NgModule({
  declarations: [NavbarComponent, NotificationModalComponent],
  imports: [CommonModule, RouterModule],
  exports: [NavbarComponent, NotificationModalComponent]
})
export class SharedModule {}
