import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Project, Task, Subtask } from './entity';
import { TodoDto, CreateTodoDto, UpdateTodoDto } from './dto';

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
          deadline: subtask.deadline,
        }));

        const processedTask = {
          id: task.id,
          toDo: task.toDo,
          done: task.done,
          deadline: task.deadline,
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
  async getByTodosId(projectId: number): Promise<TodoDto[] | any | null> {
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
        deadline: subtask.deadline,
      }));

      const processedTask = {
        id: task.id,
        toDo: task.toDo,
        done: task.done,
        deadline: task.deadline,
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
  //어떻게 짜야하지?
  async addNewTodo(newEntity: CreateTodoDto): Promise<any> {
    console.log(newEntity.parentId);
    //parent가 들어온게 없다면, project 생성
    if (newEntity.parentId === undefined) {
      const newProject = this.ProjectsRepository.create({
        toDo: newEntity.toDo,
        done: 0,
      });

      return await this.ProjectsRepository.save(newProject);
    }
    //parent가 1999999 이하의 범위라면 task 생성
    if (newEntity.parentId <= 1999999) {
      const newTask = this.TasksRepository.create({
        projectId: newEntity.parentId,
        toDo: newEntity.toDo,
        //done: 0,
        deadline: newEntity.deadline,
      });

      return await this.TasksRepository.save(newTask);
    }
    //parent가 2000000이상, 5999999 이하의 범위라면 subtask 생성
    if (newEntity.parentId >= 2000000 && newEntity.parentId <= 5999999) {
      const grandParentId = await this.TasksRepository.find({
        where: { id: newEntity.parentId },
        select: ['projectId'],
        take: 1,
      });

      const newSubTask = this.SubTasksRepository.create({
        projectId: grandParentId[0].projectId,
        taskId: newEntity.parentId,
        toDo: newEntity.toDo,
        //done: 0,
        deadline: newEntity.deadline,
      });

      return await this.SubTasksRepository.save(newSubTask);
    }
  }

  async modifyTodo(
    targetId: number,
    updatedTodo: UpdateTodoDto, //수정하고자하는 내용 -- 이름을 이렇게 짓는게 맞나?
  ): Promise<UpdateTodoDto | null> {
    //id 값을 따라, 어떤 테이블의 데이터를 수정할 건지 구분함
    // project: 0,000,000~1,999,999
    // task: 2,000,000~5,999,999
    // subtask: 6,000,000~9,999,999

    //반환은 어떻게 하는게 좋을려나
    //수정하자마자, 분기점에서 해당 (project id)를 가지고 있는 해당 todo table 데이터를 바로 return

    //특정 id에 해당하는 값이 없을 경우도 고려해야함***
    if (targetId <= 1999999) {
      await this.ProjectsRepository.createQueryBuilder()
        .update(Project)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
        })
        .where(`id = :id`, { id: targetId })
        .execute();

      const updatedData = await this.ProjectsRepository.find({
        where: {
          id: targetId,
        },
      });

      const updatedProject: UpdateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
        deadline: undefined,
      };

      return updatedProject;
    }

    if (targetId >= 2000000 && targetId <= 5999999) {
      await this.TasksRepository.createQueryBuilder()
        .update(Task)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
          deadline: updatedTodo.deadline,
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
      };

      return updatedTask;
    }
    if (targetId >= 6000000 && targetId <= 9999999) {
      await this.SubTasksRepository.createQueryBuilder()
        .update(Subtask)
        .set({
          toDo: updatedTodo.toDo,
          done: updatedTodo.done,
          deadline: updatedTodo.deadline,
        })
        .where(`id = :id`, { id: targetId })
        .execute();

      const updatedData = await this.SubTasksRepository.find({
        where: {
          id: targetId,
        },
      });
      console.log(updatedData[0]);
      const updatedSubtask: UpdateTodoDto = {
        id: updatedData[0].id,
        toDo: updatedData[0].toDo,
        done: updatedData[0].done,
        deadline: updatedData[0].deadline,
      };

      return updatedSubtask;
    }

    return null;
  }

  //id에 따라 삭제범위가 달라짐
  //project 삭제한다면 project에 딸린 task, subtask (3개의 entity)
  //task를 삭제한다면 task에 속한 subtask (2개의 entity)
  //subtask는 subtask만 (1개의 entity)

  //project의 경우 반환은 어떻게 하는게?
  //전체 조회페이지로 가면 될까? -- http://localhost:8080/to-do (http://localhost:3000/to-do)
  //그 외에는 특정 프로젝트 조회 페이지로 이동
  async deleteTodo(targetId: number): Promise<number> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    if (targetId <= 1999999) {
      //해당 데이터가 존재하는가?
      const check = await this.ProjectsRepository.find({
        where: { id: targetId },
      });
      console.log(check[0]);
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

    if (targetId >= 2000000 && targetId <= 5999999) {
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

    if (targetId >= 6000000 && targetId <= 9999999) {
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
