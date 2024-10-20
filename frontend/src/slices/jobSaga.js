
import { takeLatest, call, put, delay } from 'redux-saga/effects';
import axios from 'axios';
import { setJobProgress } from './jobSlice';

function* fetchJobProgressSaga(action) {
  const { jobId } = action.payload.jobId;
  while (true) {
    try {
      const response = yield call(axios.get, `/api/celery-progress/${jobId}/`);
      const { progress } = response.data;

      // Dispatch action to update progress in the store
      yield put(setJobProgress({ jobId, progress: progress.current, status: response.data.state }));

      // Break loop if the job is complete
      if (response.data.complete) {
        break;
      }

      // Wait for 3 seconds before fetching again
      yield delay(3000);
    } catch (error) {
      console.error("Error fetching job progress:", error);
      break; // Break loop on error
    }
  }
}

// Watch for actions
export function* watchFetchJobProgress() {
  yield takeLatest('jobs/fetchJobProgress', fetchJobProgressSaga);
}