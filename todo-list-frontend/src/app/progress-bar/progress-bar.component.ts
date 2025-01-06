import { Component, OnInit } from '@angular/core';
import { TodoService } from '../todo.service';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['progress-bar.component.scss']
})
export class ProgressBarComponent implements OnInit {

  isLoading$ = this.todoService.loading$;
  constructor(private todoService: TodoService) { }

  ngOnInit(): void {
  }

}
