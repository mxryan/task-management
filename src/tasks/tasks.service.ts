import { Injectable } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTaskById(id): Task {
    return this.tasks.find((task) => task.id === id) ?? null;
  }

  createTask(createTaskDto: CreateTaskDto): Task {
    const task: Task = {
      id: uuid(),
      title: createTaskDto.title,
      description: createTaskDto.description,
      status: TaskStatus.OPEN,
    };
    this.tasks.push(task);
    return task;
  }

  deleteTaskById(id: string): void {
    const idx: number = this.tasks.findIndex((task) => task.id === id);
    if (idx > -1) {
      this.tasks.splice(idx, 1);
    }
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const taskToUpdate = this.tasks.find((task) => task.id === id);
    if (taskToUpdate) {
      taskToUpdate.status = status;
    }
    return taskToUpdate;
  }
}
