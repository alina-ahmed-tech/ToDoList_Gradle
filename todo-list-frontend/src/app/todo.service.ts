import {Injectable} from '@angular/core';
import {Observable, of} from "rxjs";
import {delay, map} from "rxjs/operators";
import { BehaviorSubject } from 'rxjs';
import { tap } from "rxjs/operators";

export interface Todo {
  id: number;
  task: string;
  priority: 1 | 2 | 3;
}

let mockData: Todo[] = [
  { id: 0, task: 'Implement loading - frontend only', priority: 1 },
  { id: 1, task: 'Implement search - frontend only', priority: 2 },
  { id: 2, task: 'Implement delete on click - frontend only', priority: 1 },
  { id: 3, task: 'Replace mock service by integrating backend', priority: 3 },
];

function removeFromMockData(id: number) {
  mockData = mockData.filter(todo => todo.id !== id);
}

@Injectable({
  providedIn: 'root'
})
export class TodoService {

  //track loading state of progress bar
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();

  getAll(): Observable<Todo[]> {
    this.loadingSubject.next(true); //start loading
    return of(undefined).pipe(delay(2_000), map(() => mockData), 
    tap(() => this.loadingSubject.next(false))); //stop loading
  }

  remove(id: number): Observable<void> {
    this.loadingSubject.next(true); //start loading
    return new Observable<void>(observer => {
      setTimeout(() => {
        if (Math.random() < .8) {
          removeFromMockData(id);
          observer.next();
        } else {
          observer.error('Failed');
        }
        this.loadingSubject.next(false); //stop loading
        observer.complete();
      }, 2_000)
    })
  }
}
