import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactFormComponent } from './contact-form/contact-form.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, ContactFormComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'cyber-shomrim';
  isSupportFormOpen = false;

  openSupportForm() {
    this.isSupportFormOpen = true;
  }
}