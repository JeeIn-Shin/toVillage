export function classifyEntity(id: number): string {
  if (id < 2000000) return 'project';
  else if (id > 1999999 && id < 6000000) return 'task';
  else if (id > 5999999 && id < 10000000) return 'subtask';

  return undefined;
}
