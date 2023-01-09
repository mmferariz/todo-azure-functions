import { CosmosClient } from "@azure/cosmos"
 
 const getToDos = async (context, req) => {
    context.log('GET todos');

    let todos;
    try {
        todos = await getAllToDos();
    } catch (error) {
        context.log(`Error get/todos: ${error}`)
        return {
            status: 500, 
            body: {
                success: false,
                error
            }
        };
    }
    if(!todos){
        return {
            status: 204, 
            success: true,
            body: {message: "No hay tareas registradas."}
        };
    }
    console.log(`Todos selected: ${todos}`)
    return {
        status: 200,
        body: {
            success: true,
            data: todos
        }
    };
}

export default getToDos 

const getCosmosDbTodo = () => {
    const connectionString = process.env["todopracticedb_DOCUMENTDB"]

    const client = new CosmosClient(connectionString)
    const database = client.database("todo-container")
    const container = database.container("todo")

    return container
}

const getAllToDos = async () => {
    const querySpec = {
        query: "select * from c",
    };
    const container = getCosmosDbTodo()
    const {resources: todos} = await container.items.query(querySpec).fetchAll();
    if(todos.length){
        return todos.map( t => {
            return {
                id: t.id,
                title: t.title,
                description: t.description
            }
        })
    }
    return null
}