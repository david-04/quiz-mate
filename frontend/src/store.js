import { configureStore } from '@reduxjs/toolkit';
import reducers from "./reducers";

const store = configureStore({
    reducer: reducers,
    middleware: getDefaultMiddleware => getDefaultMiddleware({ thunk: true })
});

export default store;
