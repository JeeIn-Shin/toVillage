import { UpdateTodoDto } from 'src/to-do/dto';

export class DuplicateIndex {
  checkDuplicateIndexNum(todo: UpdateTodoDto[]): boolean {
    const counts = {};
    for (const item of todo) {
      const indexNum = item.indexNum;
      counts[indexNum] = counts[indexNum] ? counts[indexNum] + 1 : 1;
      if (counts[indexNum] > 1) return false;
    }
    return true;
  }

  //중복된게 있다면
  //index 전체 재설정
  //[0] = 1024, [1] = 1024*2 ...
  // n - 1 개 까지.
  avoidDuplicateIndexNum(todo: UpdateTodoDto[]): UpdateTodoDto[] {
    todo.sort((a, b) => a.indexNum - b.indexNum);

    todo.forEach((item, pos) => {
      item.indexNum = (pos + 1) * 1024;
    });

    return todo;
  }
}
