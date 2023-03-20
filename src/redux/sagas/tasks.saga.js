import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* fetchAllTasksSaga() {
    try {
        const response = yield axios.get('/api/tasks/all_tasks');
        yield put({ type: 'SET_ALL_TASKS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching all tasks:', error);
    }
}

function* addNewTaskAdminSaga(action) {
    try {
        yield axios.post('/api/tasks/admin', action.payload);
        yield put({ type: 'FETCH_ALL_TASKS' });
    } catch (error) {
        console.log('Error posting task:', error);
    }
}

function* fetchIncomingTasksSaga() {
    try {
        const response = yield axios.get('/api/tasks/not_approved');
        yield put({ type: 'SET_INCOMING_TASKS', payload: response.data });
    } catch (error) {
        console.log('Error with fetching incoming tasks:', error);
    }
}

function* fetchAllTasksForAdminSaga() {
    try {
        const response = yield axios.get('/api/tasks/user_assigned_tasks');
        yield put({ type: 'SET_ALL_TASKS_FOR_ADMIN', payload: response.data });
    } catch (error) {
        console.log('Error with fetching all tasks for admin:', error);
    }
}

function* markTaskApprovedSaga(action) {
    try {
        yield axios.put('/api/tasks/admin_approve', action.payload);
        yield put({ type: 'FETCH_INCOMING_TASKS' });
    } catch (error) {
        console.log('Error marking task as approved:', error);
    }
}

// Deny means delete in this case
function* denyTaskSaga(action) {
    try {
        yield axios.delete(`/api/tasks/${action.payload}`);
        yield put({ type: 'FETCH_INCOMING_TASKS' });
    } catch (error) {
        console.log('Error marking task as approved:', error);
    }
}



function* tasksSaga() {
    yield takeLatest('FETCH_ALL_TASKS', fetchAllTasksSaga);
    yield takeLatest('FETCH_INCOMING_TASKS', fetchIncomingTasksSaga);
    yield takeLatest("FETCH_ALL_TASKS_FOR_ADMIN", fetchAllTasksForAdminSaga);
    yield takeLatest("MARK_TASK_APPROVED", markTaskApprovedSaga);
    yield takeLatest("DENY_TASK", denyTaskSaga);
    yield takeLatest("ADD_NEW_TASK", addNewTaskAdminSaga);
}

export default tasksSaga;
