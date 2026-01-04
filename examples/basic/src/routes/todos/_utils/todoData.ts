const todoData = [
  { id: '1', title: 'Learn Hono', completed: false },
  { id: '2', title: 'Build a Todo App', completed: true },
  { id: '3', title: 'Write Documentation', completed: false },
];

export const getTodoById = (id: string) => {
  return todoData.find((todo) => todo.id === id);
};

export const getAllTodos = () => {
  return todoData;
};
