import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent {
  @Input() label: string;
  @Input() disabled: boolean;
  @Output() clicked: EventEmitter<void> = new EventEmitter<void>();

  handleClick(): void {
    this.clicked.emit();
  }
}
