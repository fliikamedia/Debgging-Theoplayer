import {
  FETCH_MOVIES,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILED,
  ADD_TO_WATCHLIST,
  ADD_TO_WATCHLIST_SUCCESS,
  ADD_TO_WATCHLIST_FAILED,
} from "../actions/movies";
const initialState = {
  availableMovies: [],
  watchList: [],
  isFetching: false,
};

const moviesReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case FETCH_MOVIES:
      return { ...state, isFetching: true };
    case FETCH_MOVIES_SUCCESS:
      return { ...state, availableMovies: payload, isFetching: false };
    case FETCH_MOVIES_FAILED:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

export default moviesReducer;
