import { call, put, select, takeLatest } from "redux-saga/effects";
import axios from "axios";
import { apiPath } from "../../config";
import qs from "qs";

export const customersSagas = () => {
  return [takeLatest(ORGANIZERS_INDEX_REQUEST, organizersWorkerSaga),
    takeLatest(REQUEST_INSERT_ANSWERS, insertWorkerSaga)];
};
export const ORGANIZERS_INDEX_REQUEST =
  "SSR/ORGANIZERS/ORGANIZERS_INDEX_REQUEST";
// ORGANIZERS RETREIVED WITH SUCCESS
const ORGANIZERS_INDEX_SUCCESS = "SSR/ORGANIZERS/ORGANIZERS_INDEX_SUCCESS";
// FAILED TO RETREIVE ORGANIZERS
const ORGANIZERS_INDEX_FAILURE = "SSR/ORGANIZERS/ORGANIZERS_INDEX_FAILURE";
// SORT Order
const CHANGE_ORDER = "SSR/ORGANIZERS/CHANGE_ORDER";
const SET_QUERY_PARAMS = "SSR/ORGANIZERS/SET_QUERY_PARAMS";
const SET_SEARCH_KEYS = "SSR/ORGANIZERS/SET_SEARCH_KEYS";
export const REQUEST_INSERT_ANSWERS = "SSR/CUSTOMERS/REQUEST_INSERT_ANSWERS";
const SUCCESS_INSERT_ANSWERS = "SSR/CUSTOMERS/SUCCESS_INSERT_ANSWERS";
const FAILURE_INSERT_ANSWERS = "SSR/CUSTOMERS/FAILURE_INSERT_ANSWERS";

const INDEX_PAGE_SIZE_DEFAULT = 10;
const INDEX_PAGE_SIZE_OPTIONS = [5, 10, 20, 30, 50, 100];

// function that makes the api request and returns a Promise for response
function fetchOrganizers(meta) {
  // console.log(meta);
  const queryParams = {
    limit: meta.pageSize,
    skip: meta.page,
    order: meta.order,
    orderBy: meta.orderBy
  };

  return axios({
    method: "get",
    url: `${apiPath}/v1/customers?${qs.stringify(queryParams)}`,
    headers: {
      ["Content-Type"]: "application/json",
      Accept: "application/json"
    }
  });
}

function requestInsertAns() {

  return axios({
    method: "get",
    url: `${apiPath}/v1/customers/insert-all`,
    headers: {
      ["Content-Type"]: "application/json",
      Accept: "application/json"
    }
  });
}

const paginationMeta = state => state.customers.meta;
// worker saga: makes the api call when watcher saga sees the action
export function* organizersWorkerSaga() {
  try {
    const meta = yield select(paginationMeta);
    const response = yield call(fetchOrganizers, meta);
    const result = response.data;
    const organizers = {
      data: result.customers,
      meta: {
        page: result.page,
        pageSize: result.limit,
        total: result.total,
        pageTotal: result.pageTotal,
      }
    };

    organizers.data = organizers.data.map(organizer => {
      organizer.key = organizer.id;
      return organizer;
    });

    // dispatch a success action to the store with the new dog
    yield put({ type: ORGANIZERS_INDEX_SUCCESS, organizers });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: ORGANIZERS_INDEX_FAILURE, error });
  }
}

export function* insertWorkerSaga() {
  try {
    const response = yield call(requestInsertAns);
    // dispatch a success action to the store with the new dog
    yield put({ type: SUCCESS_INSERT_ANSWERS });
  } catch (error) {
    // dispatch a failure action to the store with the error
    yield put({ type: FAILURE_INSERT_ANSWERS, error });
  }
}

// SINGLE ACTION TYPE TO CHANGE META DATA
const ORGANIZERS_INDEX_META = "ORGANIZERS_INDEX_META";

// ACTIONS CREATORS
export function $pageSize(pageSize = INDEX_PAGE_SIZE_DEFAULT) {
  if (pageSize < 1) {
    pageSize = 10;
  }

  if (pageSize > 100) {
    pageSize = 100;
  }

  return {
    type: ORGANIZERS_INDEX_META,
    meta: {
      pageSize,
      page: 1
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
    type: ORGANIZERS_INDEX_META,
    meta: {
      page
    }
  };
}

export function $setSort(order = "DESC", orderBy = "createdAt") {
  return {
    type: CHANGE_ORDER,
    meta: {
      order,
      orderBy
    }
  };
}

export function $setSearchKeys(searchKeys = null) {
  return {
    type: SET_SEARCH_KEYS,
    meta: {
      searchKeys
    }
  };
}

export function $setQueryParams(queryParams) {
  return {
    type: SET_QUERY_PARAMS,
    meta: queryParams
  };
}

export function reducer(
  state = {
    data: null,
    loading: false,
    btnLoading: false,
    meta: {
      page: 1,
      pageSize: INDEX_PAGE_SIZE_DEFAULT,
      pageSizeOptions: INDEX_PAGE_SIZE_OPTIONS,
      pageTotal: 1,
      total: 0,
      order: "DESC",
      orderBy: "createdAt",
      "favCategoryIds[]": null,
      cityId: null,
      searchKeys: null
    }
  },
  action
) {
  switch (action.type) {
    case ORGANIZERS_INDEX_META:
      return {
        ...state,
        loading: true,
        meta: {
          ...state.meta,
          ...action.meta
        }
      };
    case ORGANIZERS_INDEX_SUCCESS:
      return {
        ...state,
        data: action.organizers.data,
        loading: false,
        meta: { ...state.meta, ...action.organizers.meta }
      };
      case REQUEST_INSERT_ANSWERS:
        return {
          ...state,
          btnLoading: true
        };
      case SUCCESS_INSERT_ANSWERS:
        return {
          ...state,
          btnLoading: false
        };
    case CHANGE_ORDER:
      return {
        ...state,
        meta: {
          ...state.meta,
          order: action.meta.order,
          orderBy: action.meta.orderBy
        }
      };
    case SET_SEARCH_KEYS:
      return {
        ...state,
        loading: true,
        meta: {
          ...state.meta,
          searchKeys: action.meta.searchKeys
        }
      };
    case SET_QUERY_PARAMS:
      return {
        ...state,
        meta: {
          ...state.meta,
          ...action.meta
        }
      };
    default:
      return state;
  }
}
