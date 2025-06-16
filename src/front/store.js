export const initialStore=()=>{
  return{
    message: null,
    user: null,
    todos: [
      {
      }
    ]
  }
}

export default function storeReducer(store, action = {}) {
  switch(action.type){
    case 'reset_store':
      return initialStore();
    case 'add_user':
      return {
        ...store,
        user: action.payload
      };
    case 'set_hello':
      return {
        ...store,
        message: action.payload
      };
    case 'add_todos':
      return {
        ...store,
        todos: action.payload
      };  
    case 'add_task':
      const { id,  color } = action.payload
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    default:
      throw Error('Unknown action.');
  }    
}
