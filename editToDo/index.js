import { CosmosClient } from "@azure/cosmos"

const editTodo = async (context, req) => {
    context.log(`Edit todo with id: ${context.bindingData.id}`)

    const id = context.bindingData.id
    const { title, description } = req.body

    if(!id){
        return {
            status: 400,
            body: {
                success: false,
                message: "Falta id de la tarea para modificar."
            }
        };
    }

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
        res = await editTodoById(id, todoItem)
    } catch (error) {
        context.log(`Error edit/todo: ${error}`)
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
                message: "No fue posible modificar la tarea."
            }
        }
    }
    console.log(`Todo created with id: ${res.id}`)
    return {
        status: 200,
        body: {
            success: true,
            data: res
        }
    }

}

export default editTodo

const getCosmosDbTodo = () => {
    const connectionString = process.env["todopracticedb_DOCUMENTDB"]

    const client = new CosmosClient(connectionString)
    const database = client.database("todo-container")
    const container = database.container("todo")

    return container
}

const editTodoById = async (id, todo) => {
    const container = getCosmosDbTodo();
    const {resource: updatedItem} = await container.item(id, id).replace({id, ...todo});
    if(updatedItem){
        return updatedItem
    }
    return null
}