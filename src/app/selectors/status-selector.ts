import {AppRootStateType} from "app/store";

export const statusSelector = ((state: AppRootStateType) => state.app.status)