import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {delay, map} from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { tap } from "rxjs/operators";
import { HttpClient } from '@angular/common/http';


export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  private readonly API_URL = 'http://localhost:8099/api/api/todos/';

  //track loading state of progress bar
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  //list of todos
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();

  constructor(private http: HttpClient) {}

  getAll(): Observable<Todo[]> {
    this.loadingSubject.next(true); //start loading
    return this.http.get<Todo[]>(this.API_URL).pipe(
      delay(2000), //2 second delay
      tap({
        next: (todos) => {
          this.todosSubject.next(todos); 
          this.loadingSubject.next(false);
        },
        error: () => {
          this.todosSubject.next([]);
          this.loadingSubject.next(false); //stop loading
        },
      })
    );
  }

  remove(id: number): Observable<void> {
    this.loadingSubject.next(true); //start loading
    return this.http.delete<void>(`${this.API_URL}/${id}`).pipe(
      tap({
        next: () => {
          const currentTodos = this.todosSubject.value.filter((todo) => todo.id !== id);
          this.todosSubject.next(currentTodos);
          this.loadingSubject.next(false); //stop loading
        },
        error: () => {
          this.loadingSubject.next(false);
        },
      })
    );
  }
}