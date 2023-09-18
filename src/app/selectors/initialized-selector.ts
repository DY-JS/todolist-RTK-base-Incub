import {AppRootStateType} from "app/store";

export const isInitializedSelector = ((state: AppRootStateType) => state.app.isInitialized)