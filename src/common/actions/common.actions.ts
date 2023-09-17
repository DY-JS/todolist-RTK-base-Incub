import {createAction, nanoid} from "@reduxjs/toolkit";
import {TaskType} from "api/todolists-api";
import {TodolistDomainType} from "features/TodolistsList/todolists-reducer";
import {TasksStateType} from "features/TodolistsList/tasks-reducer";

export const ClearTasksAndTodolists = createAction("common/clear-tasks-todolists")

//или c дженериком
//export const ClearTasksAndTodolists = createAction<ClearTasksAndTodolistsType>("common/clear-tasks-todolists")
//тогда в ClearTasksAndTodolists передаётся payload

export type  ClearTasksAndTodolistsType = {
    tasks: TasksStateType,
    todolists: TodolistDomainType[]
}

//createAction c функцией подготовки payload
export const ClearTasksAndTodolist = createAction("common/clear-tasks-todolists",
    (tasks: TasksStateType, todolists: TodolistDomainType[] ) => {
    let random = 100

        return {                               // возвращаем подготовленный payload
            payload: {tasks, todolists, id: random > 90 ? nanoid() : Math.random()}

            }
        }
)









