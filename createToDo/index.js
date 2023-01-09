import { CosmosClient } from "@azure/cosmos"

const createTodo = async (context, req) => {
    context.log('POST todo');
    const {title, description} = req.body

    if(!title) {
        return {
            status: 400,
            body: { 
                success: false,
                message: "Falta el titulo para la tarea"
            }
        }
    }

    if(!description) {
        return {
            status: 400,
            body: { 
                success: false, 
                message: "Falta la descripción para la tarea"
            }
        }
    }

    const todoItem = {
        title,
        description
    }

    let res;
    try {
        res = await saveTodo(todoItem);
    } catch (error) {
        context.log(`Error post/todos: ${error}`)
        return {
            status: 500,
            body: {
                success: false,
                error
            }
        }
    }

    if(!res){
        return {
            status: 500,
            body: {
                success: false,
                message: "No fue posible crear la tarea."
            }
        }
    }
    console.log(`Todo created with id: ${res.id}`)
    return {
        status: 201,
        body: {
            success: true,
            data: res
        }
    }
}

export default createTodo

const getCosmosDbTodo = () => {
    const connectionString = process.env["todopracticedb_DOCUMENTDB"]

    const client = new CosmosClient(connectionString)
    const database = client.database("todo-container")
    const container = database.container("todo")

    return container
}

const saveTodo = async (todo)  => {
    const container = getCosmosDbTodo()
    const { resource: createdItem } = await container.items.create(todo)
    return createdItem
}