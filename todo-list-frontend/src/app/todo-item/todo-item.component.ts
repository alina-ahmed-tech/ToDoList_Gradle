import {Component, Input} from '@angular/core';
import {Todo} from "../todo.service";
import {EventEmitter} from '@angular/core';
import {Output} from '@angular/core';

@Component({
  selector: 'app-todo-item',
  template: `
      <div class="todo-item" (click)="onClick()">
        <div class="task-indicator">
          {{ item.task }}
        </div>
        <div class="priority-indicator" [style.background-color]="color">
          {{ item.priority }}
        </div>
      </div>
  `,
  styleUrls: ['todo-item.component.scss']
})
export class TodoItemComponent {

  @Input() item!: Todo;
  @Output() delete = new EventEmitter<number>();

  get color() {
    switch (this.item.priority) {
      case 1:
        return 'green';
      case 2:
        return 'yellow';
      case 3:
        return 'red';
    }
  }
  onClick(): void {
    this.delete.emit(this.item.id); // Emit the ID of the clicked TODO
  }
}
