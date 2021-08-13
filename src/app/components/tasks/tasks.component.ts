import { Component, OnInit } from '@angular/core';
import { TaskService } from 'src/app/services/task.service';
import { Task } from 'src/app/models/task';
import { i18nMetaToJSDoc } from '@angular/compiler/src/render3/view/i18n/meta';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
  styleUrls: ['./tasks.component.css'],
})
export class TasksComponent implements OnInit {


  searchText = '';
  showForm = false;
  editform = false;
  
  tasks: Task[] = [];
  resultTasks: Task[] = [];

  myTask: Task = { label: '', completed: false };

  constructor(private taskService: TaskService) {}
  ngOnInit() {
    this.getTasks();
  }



  getTasks() {
    this.taskService.findAll()
    .subscribe((tasks) =>{
      this.resultTasks = this.tasks = tasks
    } );
  }





  deleteTask(id: any) {
    this.taskService.delete(id).subscribe(() => {
      this.tasks = this.tasks.filter((task) => task.id != id);
      this.searchTask();
    });
  }

  persistTask() {
    this.taskService.persist(this.myTask).subscribe((task) => {
      this.tasks = [task, ...this.tasks];
      this.resetTask();
      this.showForm = false;
      this.searchTask();
    });
  }

  resetTask() {
    this.myTask = { label: '', completed: false };
  }

  toggleCompleted(task: any) {
    this.taskService.completed(task.id, task.completed).subscribe(() => {
      task.completed = !task.completed;
    });
  }

  editTask(task: any) {
    this.myTask = task;
    this.editform = true;
  }

  updateTask() {
    this.taskService.update(this.myTask).subscribe((task) => {
      this.resetTask();
      this.editform = false;
    });
  }

  searchTask() {
    this.resultTasks = this.tasks.filter((task) =>
      task.label.toLocaleLowerCase().includes(this.searchText.toLocaleLowerCase())
    );
  }
}
