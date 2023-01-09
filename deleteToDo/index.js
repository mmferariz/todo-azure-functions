import { CosmosClient } from "@azure/cosmos"

const deleteTodo = async function (context, req) {
    context.log(`Delete todo with id: ${context.bindingData.id}`)

    const id = context.bindingData.id;

    if(!id){
        return {
            status: 400,
            body: {
                success: false,
                message: "No existe id para eliminar tarea."
            }
        }
    }

    let res;
    try {
        res = await deleteTodoById(id)
    } catch (error) {
        context.log(`Error delete/todo: ${error}`)
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
                message: "No fue posible eliminar la tarea."
            }
        }
    }

    return {
        status: 200,
        body: {
            success: true,
            deleted: res
        }
    }

}

export default deleteTodo

const getCosmosDbTodo = () => {
    const connectionString = process.env["todopracticedb_DOCUMENTDB"]

    const client = new CosmosClient(connectionString)
    const database = client.database("todo-container")
    const container = database.container("todo")

    return container
}

const deleteTodoById = async (id) => {
    const container = getCosmosDbTodo();
    const {resource: res} = await container.item(id, id).delete();
    if(!res){
        return true
    }
    return false
}