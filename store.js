import {configureStore} from "@reduxjs/toolkit";
import { useReducer } from "react";

const store = configureStore({
    reducer: {
        users: usersReducer,
    },
});


export default store;