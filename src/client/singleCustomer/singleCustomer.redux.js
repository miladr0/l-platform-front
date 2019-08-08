import { call, put, select, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { apiPath } from "../../config";

export const SINGLE_REPORT_EVENT_INDEX_REQUEST =
  "SSR/EVENT/SINGLE_REPORT_EVENT_INDEX_REQUEST";
// SINGLE_REPORT_EVENT RETREIVED WITH SUCCESS
const SINGLE_REPORT_EVENT_INDEX_SUCCESS =
  "SSR/EVENT/SINGLE_REPORT_EVENT_INDEX_SUCCESS";
// FAILED TO RETREIVE SINGLE_REPORT_EVENT
const SINGLE_REPORT_EVENT_INDEX_FAILURE =
  "SSR/EVENT/SINGLE_REPORT_EVENT_INDEX_FAILURE";
// SINGLE ACTION TYPE TO CHANGE META DATA
const SINGLE_REPORT_EVENT_INDEX_META =
  "SSR/EVENT/SINGLE_REPORT_EVENT_INDEX_META";

const SINGLE_REPORT_EVENT_SET_EVENT_ID = "SSR/EVENT/SINGLE_REPORT_EVENT_SET_EVENT_ID";

export const singleCustomerSagas = () => {
    return [takeLatest(SINGLE_REPORT_EVENT_INDEX_REQUEST, singleReportEventWorkerSaga)];
  };


const INDEX_PAGE_SIZE_DEFAULT = 10;
const INDEX_PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50, 100];

// function that makes the api request and returns a Promise for response
function fetchSingleReportEvent(meta) {
  let queryParams = {
    skip: meta.page,
    limit: meta.pageSize,
    order: meta.order,
    sortBy: meta.sortBy
  };

  return axios({
    method: "get",
    url: `${apiPath}/v1/students/by-customer-id/${meta.eventId}?${serializeQuery(queryParams)}`,
    headers: {
      ["Content-Type"]: "application/json",
      Accept: "application/json",
    }
  });
}


const paginationMeta = state => state.singleCustomer.meta;

// worker saga: makes the api call when watcher saga sees the action
export function* singleReportEventWorkerSaga() {
  try {
    const meta = yield select(paginationMeta);
    const response = yield call(fetchSingleReportEvent, meta);
    const result = response.data;
    let singleReportEvent = {
      data: result.students,
      meta: {
        page: result.page,
        pageSize: result.limit,
        pageTotal: result.page_count,
        total: result.total_count
      }
    };
    singleReportEvent.data = singleReportEvent.data.map(feedback => {
      feedback.key = feedback.st_id;
      return feedback;
    });
    // dispatch a success action to the store with the new dog
    yield put({ type: SINGLE_REPORT_EVENT_INDEX_SUCCESS, singleReportEvent });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: SINGLE_REPORT_EVENT_INDEX_FAILURE, error });
  }
}

function serializeQuery(query) {
  return Object.keys(query)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(query[key])}`)
    .join("&");
}

export function $setEventId(eventId = null) {
    return {
      type: SINGLE_REPORT_EVENT_SET_EVENT_ID,
      meta: {
        eventId
      }
    };
  }

export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }

  return {
    type: SINGLE_REPORT_EVENT_INDEX_META,
    meta: {
      pageSize,
      page: 1,
      
    }
  };
}

export function $page(page = 1, meta) {
  if (page < 1) {
    page = 1;
  }

  if (page > meta.pageTotal) {
    page = meta.pageTotal - 1;
  }

  return {
    type: SINGLE_REPORT_EVENT_INDEX_META,
    meta: {
      page,
      eventId: meta.eventId
    }
  };
}

export function reducer(
  state = {
    data: null,
    categories: null,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      order: "DESC",
      sortBy: "feedbacks",
      eventId: null
    }
  },
  action
) {

  switch (action.type) {
    case SINGLE_REPORT_EVENT_INDEX_META:
       const data = {
        ...state,
        meta: {
          ...state.meta,
          ...action.meta
        }
      };
      return data;
    case SINGLE_REPORT_EVENT_INDEX_SUCCESS:
      return {
        ...state,
        data: action.singleReportEvent.data,
        meta: { ...state.meta, ...action.singleReportEvent.meta }
      };
      case SINGLE_REPORT_EVENT_SET_EVENT_ID:
            return {
              ...state,
              meta: {
                ...state.meta,
                eventId: action.meta.eventId,
              }
            };  
    default:
      return state;
  }
}
