import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, Task, Subtask } from './entity';
import { todoFormtDto } from './dto/to-do.dto';

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
    console.log(newSubTaskEntity);
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

  // async modifyTodo(
  //   todoId: number,
  //   updatedTodo: todoFormtDto,
  // ): Promise<any[] | null> {
  //   await this.ProjectsRepository.createQueryBuilder()
  //     .update(Task)
  //     .set({
  //       toDo: updatedTodo.project,
  //       done: updatedTodo.done,
  //     })
  //     .where(`id = :id`, { id: todoId })
  //     .execute();

  //   await this.TasksRepository.createQueryBuilder()
  //     .update(Task)
  //     .set({
  //       toDo: updatedTodo.task.toDo,
  //       done: updatedTodo.task.done,
  //     })
  //     .where(`id = :id`, { id: todoId })
  //     .execute();

  //   await this.SubTasksRepository.createQueryBuilder()
  //     .update(Task)
  //     .set({
  //       toDo: updatedTodo.task.subtask.toDo,
  //       done: updatedTodo.task.subtask.done,
  //     })
  //     .where(`id = :id`, { id: todoId })
  //     .execute();

  //   return await this.ProjectsRepository.createQueryBuilder('project')
  //     .innerJoin('project.task', 'task')
  //     .innerJoin('project.subtask', 'subtask')
  //     .where(`project.id = :id`, { id: todoId })
  //     .getRawMany();
  // }

  // async deleteTodo(taskId: number): Promise<Task> {
  //   const targetTask = await this.TasksRepository.findOne({
  //     where: {
  //       id: taskId,
  //     },
  //   });

  //   return await this.TasksRepository.remove(targetTask);
  // }
}
