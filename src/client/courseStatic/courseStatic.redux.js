import { call, put, select, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { apiPath } from "../../config";

export const SINGLE_USER_REQUEST = "SSR/USERS/SINGLE_USER/GET_USER";
export const SINGLE_USER_SUCCESS = "SSR/USERS/SINGLE_USER/SUCCESS_GET_INFO";
export const SINGLE_USER_FAILURE = "SSR/USERS/SINGLE_USER/FAILED_GET_INFO";
export const SET_USER_ID = "SSR/USERS/SINGLE_USER/SET_USER_ID";
export const SET_SUBSCRIPTION_STATUS =
  "SSR/USERS/SINGLE_USER/SET_SUBSCRIPTION_STATUS";
export const REQUEST_SUBSCRIPTION =
  "SSR/USERS/SINGLE_USER/REQUEST_SUBSCRIPTION";
export const SUCCESSFUL_SUBSCRIBED =
  "SSR/USERS/SINGLE_USER/SUCCESSFUL_SUBSCRIBED";
export const SUCCESSFUL_UNSUBSCRIBED =
  "SSR/USERS/SINGLE_USER/SUCCESSFUL_UNSUBSCRIBED";

// function that makes the api request and returns a Promise for response
function fetchUser(userId, courseId) {
  return axios({
    method: "get",
    url: `${apiPath}/v1/courses/course-statics/${userId}/${courseId}`,
    headers: {
      ["Content-Type"]: "application/json",
      Accept: "application/json",
    }
  });
}

export const courseStaticSagas = () => {
    return [takeLatest(SINGLE_USER_REQUEST, userWorkerSaga)];
  };

const userId = state => state.courseStatic.userId;
const courseId = state => state.courseStatic.courseId;

// worker saga: makes the api call when watcher saga sees the action
export function* userWorkerSaga() {
  try {
    const singleUserId = yield select(userId);
    const singleCourseId = yield select(courseId);
    const response = yield call(fetchUser, singleUserId, singleCourseId);
    const user = response.data;


    user.answers = user.answers.map(ans => {
      ans.key = ans.question_id;
      return ans;
    });

    // dispatch a success action to the store with the new dog
    yield put({ type: SINGLE_USER_SUCCESS, user });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: SINGLE_USER_FAILURE, error });
  }
}




export const $setSubscriptionStatus = (status = true) => {
  console.log(status);
  return {
    type: SET_SUBSCRIPTION_STATUS,
    action: { status, loading: true }
  };
};

export const $setUserId = (userId, courseId) => {
  return {
    type: SET_USER_ID,
    userId,
    courseId
  };
};

export function reducer(
  state = {
    info: null,
    userId: null,
    courseId: null,
    status: true,
    loading: false
  },
  action
) {
  switch (action.type) {
    case SINGLE_USER_SUCCESS:
      return {
        ...state,
        info: action.user,
        loading: false
      };
    case SET_USER_ID:
      return {
        ...state,
        userId: action.userId,
        courseId: action.courseId,
      };
    case SET_SUBSCRIPTION_STATUS:
      return {
        ...state,
        status: action.action.status,
        loading: action.action.loading
      };
    default:
      return state;
  }
}
