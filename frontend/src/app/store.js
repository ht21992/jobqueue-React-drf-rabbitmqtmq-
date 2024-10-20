import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';
import jobSlice from '../slices/jobSlice';
import { watchFetchJobProgress } from '../slices/jobSaga'; // Import your saga

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
    reducer: {
        job: jobSlice,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware().concat(sagaMiddleware),
});

// Run the saga
sagaMiddleware.run(watchFetchJobProgress);