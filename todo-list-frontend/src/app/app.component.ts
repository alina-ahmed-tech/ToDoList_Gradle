import {Component} from '@angular/core';
import {Todo, TodoService} from "./todo.service";
import {Observable} from "rxjs";
import { BehaviorSubject } from "rxjs";
import { combineLatest } from "rxjs";
import { map } from "rxjs/operators";
import { switchMap } from 'rxjs/operators';


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
      <app-todo-item *ngFor="let todo of filteredTodos$ | async" [item]="todo" (delete)="deleteTodo($event)"></app-todo-item>
        <div *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
    </div>
  `,
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  readonly todos$: Observable<Todo[]>;

  private searchTermSubject = new BehaviorSubject<string>('');
  readonly filteredTodos$: Observable<Todo[]>;

  errorMessage: string | null = null; //error message for failed delete

  constructor(private todoService: TodoService) {
    this.todos$ = this.todoService.getAll().pipe(
      // once the initial fetch is complete, switch to observing reactive updates
      switchMap(() => this.todoService.todos$)
    );

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

  deleteTodo(id: number): void {
    this.todoService.remove(id).subscribe({
      next: () => {
        this.errorMessage = null; // Clear error message on success
      },
      error: () => {
        this.errorMessage = `Failed to delete TODO with id ${id}. Please try again.`;
      }
    });
  }
  
}
