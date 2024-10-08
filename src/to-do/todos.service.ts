import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, Task, Subtask } from './entity';
import { TodoDto, CreateTodoDto, UpdateTodoDto } from './dto';
import { DuplicateIndex, classifyEntity } from 'src/utils';
import { User } from 'src/user/entity/user';

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

    private dataSource: DataSource,
  ) {}

  async getAllTodos(): Promise<any> {
    const projects = await this.ProjectsRepository.find();

    const todos = [];
    for (const project of projects) {
      const tasks = await this.TasksRepository.find({
        where: { projectId: project.id },
        order: { indexNum: 'ASC' },
      });

      const processedTasks = [];
      for (const task of tasks) {
        const subtasks = await this.SubTasksRepository.find({
          where: { task: { id: task.id } },
          order: { indexNum: 'ASC' },
        });

        const processedSubtasks = subtasks.map((subtask) => ({
          id: subtask.id,
          toDo: subtask.toDo,
          done: subtask.done,
          deadline: subtask.deadline,
          hexColorCode: subtask.hexColorCode,
          indexNum: subtask.indexNum,
        }));

        const processedTask = {
          id: task.id,
          toDo: task.toDo,
          done: task.done,
          deadline: task.deadline,
          hexColorCode: task.hexColorCode,
          indexNum: task.indexNum,
          subtasks: processedSubtasks,
        };

        processedTasks.push(processedTask);
      }

      // 프로젝트를 가공
      todos.push({
        id: project.id,
        toDo: project.toDo,
        hexColorCode: project.hexColorCode,
        tasks: processedTasks,
      });
    }

    return todos;
  }

  async getByTodosId(id: number): Promise<TodoDto[] | any | null> {
    if (classifyEntity(id) === 'project') {
      const project = await this.ProjectsRepository.find({
        where: { id: id },
        take: 1,
      });

      if (!project) return null;

      const todos = [];

      const tasks = await this.TasksRepository.find({
        where: { projectId: id },
        order: { indexNum: 'ASC' }, //내림차순 추가
      });

      const processedTasks = [];
      for (const task of tasks) {
        const subtasks = await this.SubTasksRepository.find({
          where: { task: { id: task.id } },
          order: { indexNum: 'ASC' }, //내림차순 추가
        });

        const processedSubtasks = subtasks.map((subtask) => ({
          id: subtask.id,
          toDo: subtask.toDo,
          done: subtask.done,
          deadline: subtask.deadline,
          hexColorCode: subtask.hexColorCode,
          indexNum: subtask.indexNum,
        }));

        const processedTask = {
          id: task.id,
          toDo: task.toDo,
          done: task.done,
          deadline: task.deadline,
          hexColorCode: task.hexColorCode,
          indexNum: task.indexNum,
          subtasks: processedSubtasks,
        };

        processedTasks.push(processedTask);
      }

      todos.push({
        id: project[0].id,
        toDo: project[0].toDo,
        hexColorCode: project[0].hexColorCode,
        tasks: processedTasks,
      });

      return todos;
    }
    if (classifyEntity(id) === 'task') {
      const tasks = await this.TasksRepository.find({
        where: { id: id },
        take: 1,
      });

      if (!tasks) return null;

      const subtasks = await this.SubTasksRepository.find({
        where: { taskId: id },
        order: { indexNum: 'ASC' }, //내림차순 추가
      });

      return subtasks;
    }
  }

  async addNewTodo(newEntity: CreateTodoDto, user: User): Promise<any> {
    //parent가 들어온게 없다면, project 생성
    if (classifyEntity(newEntity.parentId) === undefined) {
      const newProject = this.ProjectsRepository.create({
        toDo: newEntity.toDo,
        hexColorCode: newEntity.hexColorCode,
        uuid: user,
      });

      return await this.ProjectsRepository.save(newProject);
    }
    //parent가 1999999 이하의 범위라면 task 생성
    if (classifyEntity(newEntity.parentId) === 'project') {
      //Task Entity에서 해당 parentId를 가지고 있는 Task(s)가 있는지 먼저 조회
      //Task가 없다면 => indexNum = 1024
      //Task(s)가 이미 존재한다면 indexNum = Task(s) 개수 * 1024
      const parentHexColor = await this.ProjectsRepository.find({
        where: { id: newEntity.parentId },
        select: ['hexColorCode'],
      });

      const taskCount = await this.TasksRepository.find({
        where: { projectId: newEntity.parentId },
      });

      if (taskCount.length < 1) {
        const newTask = this.TasksRepository.create({
          projectId: newEntity.parentId,
          toDo: newEntity.toDo,
          deadline: newEntity.deadline,
          hexColorCode: parentHexColor[0].hexColorCode,
          indexNum: 1024,
        });

        return await this.TasksRepository.save(newTask);
      } else {
        const newTask = this.TasksRepository.create({
          projectId: newEntity.parentId,
          toDo: newEntity.toDo,
          deadline: newEntity.deadline,
          hexColorCode: parentHexColor[0].hexColorCode,
          indexNum: (taskCount.length + 1) * 1024,
        });

        return await this.TasksRepository.save(newTask);
      }
    }
    //parent가 2000000이상, 5999999 이하의 범위라면 subtask 생성
    if (classifyEntity(newEntity.parentId) === 'task') {
      const parentHexColor = await this.TasksRepository.find({
        where: { id: newEntity.parentId },
        select: ['hexColorCode'],
      });

      const grandParentId = await this.TasksRepository.find({
        where: { id: newEntity.parentId },
        select: ['projectId'],
        take: 1,
      });

      //SubTask가 존재하는지 여기서 확인하는 절차를 가져야함
      const subTaskCount = await this.SubTasksRepository.find({
        where: { taskId: newEntity.parentId },
      });

      if (subTaskCount.length < 1) {
        const newSubTask = this.SubTasksRepository.create({
          projectId: grandParentId[0].projectId,
          taskId: newEntity.parentId,
          toDo: newEntity.toDo,
          deadline: newEntity.deadline,
          hexColorCode: parentHexColor[0].hexColorCode,
          indexNum: 1024,
        });

        return await this.SubTasksRepository.save(newSubTask);
      } else {
        const newSubTask = this.SubTasksRepository.create({
          projectId: grandParentId[0].projectId,
          taskId: newEntity.parentId,
          toDo: newEntity.toDo,
          deadline: newEntity.deadline,
          hexColorCode: parentHexColor[0].hexColorCode,
          indexNum: (subTaskCount.length + 1) * 1024,
        });

        return await this.SubTasksRepository.save(newSubTask);
      }
    }
  }

  async modifyTodo(updatedTodo: UpdateTodoDto): Promise<UpdateTodoDto | null> {
    const targetId = updatedTodo.id;
    if (classifyEntity(targetId) === 'project') {
      const queryRunner = this.dataSource.createQueryRunner();
      await queryRunner.connect();
      await queryRunner.startTransaction();
      try {
        await queryRunner.manager
          .createQueryBuilder()
          .update(Project)
          .set({
            toDo: updatedTodo.toDo,
            hexColorCode: updatedTodo.hexColorCode,
          })
          .where('id = :id', { id: targetId })
          .execute();

        // 프로젝트에 속한 task의 hexColorCode 업데이트
        await queryRunner.manager
          .createQueryBuilder()
          .update(Task)
          .set({ hexColorCode: updatedTodo.hexColorCode })
          .where('projectId = :id', { id: targetId })
          .execute();

        // 프로젝트에 속한 subtask의 hexColorCode 업데이트
        await queryRunner.manager
          .createQueryBuilder()
          .update(Subtask)
          .set({
            hexColorCode: updatedTodo.hexColorCode,
          })
          .where('projectId = :id', { id: targetId })
          .execute();
        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
        const updatedData = await this.ProjectsRepository.find({
          where: {
            id: targetId,
          },
        });

        const updatedProject: UpdateTodoDto = {
          id: updatedData[0].id,
          toDo: updatedData[0].toDo,
          done: undefined,
          deadline: undefined,
          hexColorCode: updatedData[0].hexColorCode,
          indexNum: undefined,
        };

        return updatedProject;
      }
    }
    if (classifyEntity(targetId) === 'task') {
      await this.TasksRepository.createQueryBuilder()
        .update(Task)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
          deadline: updatedTodo.deadline,
          indexNum: updatedTodo.indexNum,
        })
        .where(`id = :id`, { id: targetId })
        .execute();

      const updatedData = await this.TasksRepository.find({
        where: {
          id: targetId,
        },
      });

      const updatedTask: UpdateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
        deadline: updatedData[0].deadline,
        hexColorCode: updatedData[0].hexColorCode,
        indexNum: updatedData[0].indexNum,
      };

      return updatedTask;
    }
    if (classifyEntity(targetId) === 'subtask') {
      await this.SubTasksRepository.createQueryBuilder()
        .update(Subtask)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
          deadline: updatedTodo.deadline,
          indexNum: updatedTodo.indexNum,
        })
        .where(`id = :id`, { id: targetId })
        .execute();

      const updatedData = await this.SubTasksRepository.find({
        where: {
          id: targetId,
        },
      });

      const updatedSubtask: UpdateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
        deadline: updatedData[0].deadline,
        hexColorCode: updatedData[0].hexColorCode,
        indexNum: updatedData[0].indexNum,
      };

      return updatedSubtask;
    }

    return null;
  }

  //변경된 indexNum 받아와서, 중복된 부분이 없다면 그대로 반영, 그게 아니라면 idx 재설정
  async modifyOrder(todo: UpdateTodoDto[]): Promise<TodoDto[] | null> {
    console.log(todo[0].id);
    const targetId = todo[0].id;

    if (classifyEntity(targetId) === 'task') {
      if (DuplicateIndex.prototype.checkDuplicateIndexNum(todo)) {
        for (const item of todo) {
          await this.TasksRepository.createQueryBuilder()
            .update(Task)
            .set({ indexNum: item.indexNum })
            .where(`id = :id`, { id: item.id })
            .execute();
        }

        const parentId = await this.TasksRepository.find({
          where: { id: todo[0].id },
          select: ['projectId'],
        });

        return this.getByTodosId(parentId[0].projectId);
      } else {
        const parentId = await this.TasksRepository.find({
          where: { id: todo[0].id },
          select: ['projectId'],
        });

        const reorderTodo =
          DuplicateIndex.prototype.avoidDuplicateIndexNum(todo);

        const updateValues = reorderTodo.map((item) => ({
          indexNum: item.indexNum,
          id: item.id,
        }));

        for (const item of updateValues) {
          await this.TasksRepository.createQueryBuilder()
            .update(Task)
            .set({ indexNum: item.indexNum })
            .where(`id = :id`, { id: item.id })
            .execute();
        }
        return this.getByTodosId(parentId[0].projectId);
      }
    }
    if (classifyEntity(targetId) === 'subtask') {
      if (DuplicateIndex.prototype.checkDuplicateIndexNum(todo)) {
        for (const item of todo) {
          await this.SubTasksRepository.createQueryBuilder()
            .update(Subtask)
            .set({ indexNum: item.indexNum })
            .where(`id = :id`, { id: item.id })
            .execute();
        }

        const parentId = await this.SubTasksRepository.find({
          where: { id: todo[0].id },
          select: ['taskId'],
        });

        return this.getByTodosId(parentId[0].taskId);
      } else {
        const parentId = await this.SubTasksRepository.find({
          where: { id: todo[0].id },
          select: ['taskId'],
          take: 1,
        });

        const reorderTodo =
          DuplicateIndex.prototype.avoidDuplicateIndexNum(todo);

        const updateValues = reorderTodo.map((item) => ({
          indexNum: item.indexNum,
          id: item.id,
        }));

        for (const item of updateValues) {
          await this.SubTasksRepository.createQueryBuilder()
            .update(Subtask)
            .set({ indexNum: item.indexNum })
            .where(`id = :id`, { id: item.id })
            .execute();
        }
        return this.getByTodosId(parentId[0].taskId);
      }
    }
  }

  async modifyDone(updatedTodo: UpdateTodoDto): Promise<TodoDto> {
    const targetId = updatedTodo.id;

    if (classifyEntity(targetId) === 'task') {
      await this.TasksRepository.createQueryBuilder()
        .update(Task)
        .set({
          done: updatedTodo.done,
        })
        .where(`id = :id`, { id: targetId })
        .execute();

      const updatedData = await this.TasksRepository.find({
        where: {
          id: targetId,
        },
      });

      const updatedTask: UpdateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
        deadline: updatedData[0].deadline,
        hexColorCode: updatedData[0].hexColorCode,
        indexNum: updatedData[0].indexNum,
      };

      return updatedTask;
    }
    if (classifyEntity(targetId) === 'subtask') {
      await this.SubTasksRepository.createQueryBuilder()
        .update(Subtask)
        .set({
          done: updatedTodo.done,
        })
        .where(`id = :id`, { id: targetId })
        .execute();

      const updatedData = await this.SubTasksRepository.find({
        where: {
          id: targetId,
        },
      });

      const updatedSubtask: UpdateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
        deadline: updatedData[0].deadline,
        hexColorCode: updatedData[0].hexColorCode,
        indexNum: updatedData[0].indexNum,
      };

      return updatedSubtask;
    }

    return null;
  }

  async deleteTodo(targetId: number): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (classifyEntity(targetId) === 'project') {
      //해당 데이터가 존재하는가?
      const check = await this.ProjectsRepository.find({
        where: { id: targetId },
      });

      if (check[0] === undefined) return -1;
      try {
        //아래 코드는 계속해서 외래키 관련해서 에러가 발생함
        //쿼리를 옮겨쓰는 과정에서 뭔가 이해를 잘못한거 같음
        /* query: 'DELETE FROM `project` WHERE `id` = ?',
         parameters: [ 2 ],
         driverError: Error: Cannot delete or update a parent row: a foreign key constraint fails (`tovillage`.`task`, CONSTRAINT `FK_3797a20ef5553ae87af126bc2fe` FOREIGN KEY (`projectId`) REFERENCES `project` (`id`))
        const result = await this.ProjectsRepository.createQueryBuilder(
          'project',
        )
          .innerJoinAndSelect('project.tasks', 'task')
          .innerJoinAndSelect('task.subtasks', 'subtask')
          .where('id = :id', { id: targetId })
          .delete()
          .execute(); */

        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(Subtask)
          .where('projectId = :id', { id: targetId })
          .execute();

        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(Task)
          .where('projectId = :id', { id: targetId })
          .execute();

        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(Project)
          .where('id = :id', { id: targetId })
          .execute();

        await queryRunner.commitTransaction();
      } catch (err) {
        await queryRunner.rollbackTransaction();
        throw err;
      } finally {
        await queryRunner.release();
        return 1;
      }
    }

    if (classifyEntity(targetId) === 'task') {
      const targetProjectId = await this.TasksRepository.find({
        where: { id: targetId },
        select: ['projectId'],
      });
      try {
        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(Subtask)
          .where('taskId = :id', { id: targetId })
          .execute();

        await queryRunner.manager
          .createQueryBuilder()
          .delete()
          .from(Task)
          .where('id = :id', { id: targetId })
          .execute();

        await queryRunner.commitTransaction();
      } catch (error) {
        await queryRunner.rollbackTransaction();
        throw error;
      } finally {
        await queryRunner.release();
        return targetProjectId[0].projectId;
      }
    }

    if (classifyEntity(targetId) === 'subtask') {
      //subtask가 속한 project id 먼저 조회
      try {
        const targetProjectId = await this.SubTasksRepository.find({
          where: { id: targetId },
          select: ['projectId'],
        });

        //targetSubtask 삭제
        const result = await this.SubTasksRepository.createQueryBuilder(
          'subtask',
        )
          .where('id = :id', { id: targetId })
          .delete()
          .execute();
        // 삭제된 행이 있는지 확인
        if (result.affected === 0) {
          return -1; // 삭제된 행이 없을 경우 -1 반환
        }

        // 삭제 성공 시
        // subtask가 가지고 있던 projectId 반환
        return targetProjectId[0].projectId;
      } catch (error) {
        console.error('삭제 중 오류 발생:', error);
        return error;
      }
    }
  }
}
