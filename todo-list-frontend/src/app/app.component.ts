import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable} from "rxjs";
import { BehaviorSubject } from "rxjs";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";


@Component({
  selector: 'app-root',
  template: `
    <div class="title">
      <h1>
        A list of TODOs
      </h1>
    </div>
    <div class="list">
      <label for="search">Search...</label>
        <input id="search" type="text" (input)="onSearch($any($event.target).value)">
      <app-progress-bar></app-progress-bar>
      <app-todo-item *ngFor="let todo of filteredTodos$ | async" [item]="todo"></app-todo-item>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  readonly todos$: Observable<Todo[]>;

  private searchTermSubject = new BehaviorSubject<string>('');
  readonly filteredTodos$: Observable<Todo[]>;

  constructor(todoService: TodoService) {
    this.todos$ = todoService.getAll();

    this.filteredTodos$ = combineLatest([this.todos$, this.searchTermSubject]).pipe(
      map(([todos, searchTerm]) =>
        todos.filter(todo =>
          todo.task.toLowerCase().includes(searchTerm.toLowerCase())
        )
      )
    );
  }

  onSearch(searchTerm: string): void {
    this.searchTermSubject.next(searchTerm);
  }
}
