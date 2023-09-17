import {todolistsAPI, TodolistType} from "api/todolists-api"
import {appActions, RequestStatusType} from "app/app-reducer"
import {handleServerNetworkError} from "utils/error-utils"
import {AppThunk} from "app/store"
import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import {ClearTasksAndTodolists} from "common/actions/common.actions";

const slice = createSlice({
    name: "todolists",
    initialState: [] as TodolistDomainType[],
    reducers: {
        removeTodolist: (state, action: PayloadAction<{ id: string }>) => {
            // return state.filter((tl) => tl.id !== action.payload.id)
            const index = state.findIndex((todo) => todo.id === action.payload.id)
            if (index !== -1) state.splice(index, 1)
        },
        addTodolist: (state, action: PayloadAction<{ todolist: TodolistType }>) => {
            const newTodo: TodolistDomainType = {...action.payload.todolist, filter: "all", entityStatus: "idle"}
            state.unshift(newTodo)
        },
        changeTodolistTitle: (state, action: PayloadAction<{ id: string; title: string }>) => {
            // 1 variant
            // const index = state.findIndex(todo => todo.id === action.payload.id)
            // if (index !== -1) state[index].title = action.payload.title

            // 2 variant
            const todolist = state.find((todo) => todo.id === action.payload.id)
            if (todolist) {
                todolist.title = action.payload.title
            }
        },
        changeTodolistFilter: (state, action: PayloadAction<{ id: string; filter: FilterValuesType }>) => {
            const todolist = state.find((todo) => todo.id === action.payload.id)
            if (todolist) {
                todolist.filter = action.payload.filter
            }
        },
        changeTodolistEntityStatus: (state, action: PayloadAction<{ id: string; entityStatus: RequestStatusType }>) => {
            const todolist = state.find((todo) => todo.id === action.payload.id)
            if (todolist) {
                todolist.entityStatus = action.payload.entityStatus
            }
        },
        setTodolists: (state, action: PayloadAction<{ todolists: TodolistType[] }>) => {
            // 1 variant
            // return action.payload.todolists.map((tl) => ({ ...tl, filter: "all", entityStatus: "idle" }))

            // 2 variant
            action.payload.todolists.forEach((tl) => {
                state.push({...tl, filter: "all", entityStatus: "idle"})
            })
        },
        // clearTodolistsData: () => [] as TodolistDomainType[]
    },
    extraReducers: (builder) => {
        builder
            .addCase(ClearTasksAndTodolists.type, () => {
                return []
            })
            // .addCase(ClearTasksAndTodolists, (state, action) => {  2-й вариант с типом и payload
            //     return action.payload.todolists
            // })
    }

})

export const todolistsReducer = slice.reducer
export const todolistsActions = slice.actions  //todolistsActions cодержат setTodolists, changeTodolistEntityStatus,....

// thunks
export const fetchTodolistsTC = (): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI
            .getTodolists()
            .then((res) => {
                dispatch(todolistsActions.setTodolists({todolists: res.data}))
                dispatch(appActions.setAppStatus({status: "succeeded"}))
            })
            .catch((error) => {
                handleServerNetworkError(error, dispatch)
            })
    }
}

export const removeTodolistTC = (id: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        dispatch(todolistsActions.changeTodolistEntityStatus({id, entityStatus: "loading"}))
        todolistsAPI.deleteTodolist(id).then(() => {
            dispatch(todolistsActions.removeTodolist({id}))
            dispatch(appActions.setAppStatus({status: "succeeded"}))
        })
    }
}

export const addTodolistTC = (title: string): AppThunk => {
    return (dispatch) => {
        dispatch(appActions.setAppStatus({status: "loading"}))
        todolistsAPI.createTodolist(title).then((res) => {
            dispatch(todolistsActions.addTodolist({todolist: res.data.data.item}))
            dispatch(appActions.setAppStatus({status: "succeeded"}))
        })
    }
}
export const changeTodolistTitleTC = (id: string, title: string): AppThunk => {
    return (dispatch) => {
        todolistsAPI.updateTodolist(id, title).then(() => {
            dispatch(todolistsActions.changeTodolistTitle({id, title}))
        })
    }
}

// types
export type FilterValuesType = "all" | "active" | "completed"
export type TodolistDomainType = TodolistType & {
    filter: FilterValuesType
    entityStatus: RequestStatusType
}
