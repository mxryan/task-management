import { Injectable, NotFoundException } from "@nestjs/common";
import { Task, TaskStatus } from './task.model';
import { v4 as uuid } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilters(filterDto: GetTasksFilterDto): Task[] {
    const { status, search } = filterDto;
    let filtered: Task[] = [];
    if (status) {
      filtered = this.tasks.filter((t) => t.status === status);
    }
    if (search) {
      filtered = filtered.filter((t) => {
        return (
          t.title.toLowerCase().includes(search.toLowerCase()) ||
          t.description.toLowerCase().includes(search.toLowerCase())
        );
      });
    }
    return filtered;
  }

  getTaskById(id): Task {
    let task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException(`Task with id ${id} not found.`);
    }
    return task;
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
    throw new NotFoundException(`Task with id ${id} not found.`)
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const taskToUpdate = this.getTaskById(id);
    if (taskToUpdate) {
      taskToUpdate.status = status;
    }
    return taskToUpdate;
  }
}
