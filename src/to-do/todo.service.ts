import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, Task, Subtask } from './entity';
import { todoFormtDto } from './dto/todo.dto';
import { updateTodoDto } from './dto/update-todo.dto';

//project, project-task, project-task-subtask 3가지로 나누어야함
@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Project)
    private ProjectsRepository: Repository<Project>,
    @InjectRepository(Task)
    private TasksRepository: Repository<Task>,
    @InjectRepository(Subtask)
    private SubTasksRepository: Repository<Subtask>,
  ) {}

  async getAllTodos(): Promise<any> {
    const projects = await this.ProjectsRepository.find();

    const todos = [];
    for (const project of projects) {
      const tasks = await this.TasksRepository.find({
        where: { projectId: project.id },
      });

      const processedTasks = [];
      for (const task of tasks) {
        const subtasks = await this.SubTasksRepository.find({
          where: { task: { id: task.id } },
        });

        const processedSubtasks = subtasks.map((subtask) => ({
          id: subtask.id,
          toDo: subtask.toDo,
          done: subtask.toDo,
        }));

        const processedTask = {
          id: task.id,
          toDo: task.toDo,
          done: task.done,
          subtasks: processedSubtasks,
        };

        processedTasks.push(processedTask);
      }

      // 프로젝트를 가공
      todos.push({
        id: project.id,
        toDo: project.toDo,
        tasks: processedTasks,
      });
    }

    return todos;
  }

  //프로젝트 개별 조회 - project task subtask id로 묶어서 조회해야함
  //해당 프로젝트 id를 가지고 있는 project task subtask entity를 모두 가져와야함
  async getByTodosId(projectId: number): Promise<todoFormtDto[] | any | null> {
    const project = await this.ProjectsRepository.find({
      where: { id: projectId },
      take: 1,
    });

    if (!project) return null;

    const todos = [];

    const tasks = await this.TasksRepository.find({
      where: { projectId: projectId },
    });

    const processedTasks = [];
    for (const task of tasks) {
      const subtasks = await this.SubTasksRepository.find({
        where: { task: { id: task.id } },
      });

      const processedSubtasks = subtasks.map((subtask) => ({
        id: subtask.id,
        toDo: subtask.toDo,
        done: subtask.done,
      }));

      const processedTask = {
        id: task.id,
        toDo: task.toDo,
        done: task.done,
        subtasks: processedSubtasks,
      };

      processedTasks.push(processedTask);
    }

    todos.push({
      id: project[0].id,
      toDo: project[0].toDo,
      tasks: processedTasks,
    });

    return todos;
  }

  //만약 하나만 추가한다면?? ex, project만 생성한다던가...
  //현재는 project, task, subtask 모두 동시에 추가해야함
  async addNewTodo(newEntity: todoFormtDto): Promise<any> {
    //create는 생성만 하며, 저장하지 않음
    const newProjectEntity = this.ProjectsRepository.create({
      toDo: newEntity.toDo,
      done: newEntity.done,
    });

    await this.ProjectsRepository.save(newProjectEntity);

    const newTaskEntity = this.TasksRepository.create({
      toDo: newEntity.task.toDo,
      done: newEntity.task.done,
      projectId: newProjectEntity.id,
    });

    await this.TasksRepository.save(newTaskEntity);

    const newSubTaskEntity = this.SubTasksRepository.create({
      toDo: newEntity.task.subtask.toDo,
      done: newEntity.task.subtask.done,
      taskId: newTaskEntity.id, // 참조
      projectId: newTaskEntity.projectId,
    });

    await this.SubTasksRepository.save(newSubTaskEntity);

    const savedProject = await this.ProjectsRepository.findOne({
      where: {
        id: newProjectEntity.id,
      },
    });
    const savedTask = await this.TasksRepository.findOne({
      where: {
        id: newTaskEntity.id,
      },
    });
    const savedSubtask = await this.SubTasksRepository.findOne({
      where: {
        id: newSubTaskEntity.id,
      },
    });

    return {
      project: savedProject,
      task: savedTask,
      subtask: savedSubtask,
    };
  }

  async modifyTodo(
    todoId: number,
    updatedTodo: updateTodoDto, //수정하고자하는 내용 -- 이름을 이렇게 짓는게 맞나?
  ): Promise<updateTodoDto | null> {
    //id 값을 따라, 어떤 테이블의 데이터를 수정할 건지 구분함
    // project: 0,000,000~1,999,999
    // task: 2,000,000~5,999,999
    // subtask: 6,000,000~9,999,999

    //반환은 어떻게 하는게 좋을려나
    //수정하자마자, 분기점에서 해당 (project id)를 가지고 있는 해당 todo table 데이터를 바로 return

    //특정 id에 해당하는 값이 없을 경우도 고려해야함***
    if (todoId <= 1999999) {
      await this.ProjectsRepository.createQueryBuilder()
        .update(Project)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
        })
        .where(`id = :id`, { id: todoId })
        .execute();

      const updatedData = await this.ProjectsRepository.find({
        where: {
          id: todoId,
        },
      });

      const updatedProject: updateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
      };

      return updatedProject;
    }

    if (todoId >= 2000000 || todoId <= 5999999) {
      await this.ProjectsRepository.createQueryBuilder()
        .update(Task)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
        })
        .where(`id = :id`, { id: todoId })
        .execute();

      const updatedData = await this.TasksRepository.find({
        where: {
          id: todoId,
        },
      });

      const updatedTask: updateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
      };

      return updatedTask;
    }
    if (todoId >= 6000000 || todoId <= 9999999) {
      await this.ProjectsRepository.createQueryBuilder()
        .update(Subtask)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
        })
        .where(`id = :id`, { id: todoId })
        .execute();

      const updatedData = await this.TasksRepository.find({
        where: {
          id: todoId,
        },
      });

      const updatedSubtask: updateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
      };

      return updatedSubtask;
    }

    return null;
  }

  // async deleteTodo(taskId: number): Promise<Task> {
  //   const targetTask = await this.TasksRepository.findOne({
  //     where: {
  //       id: taskId,
  //     },
  //   });

  //   return await this.TasksRepository.remove(targetTask);
  // }
}
