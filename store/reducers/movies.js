import {
  FETCH_MOVIES,
  FETCH_MOVIES_SUCCESS,
  FETCH_MOVIES_FAILED,
  ADD_TO_WATCHLIST,
  ADD_TO_WATCHLIST_SUCCESS,
  ADD_TO_WATCHLIST_FAILED,
  SET_MOVIE,
  SET_CURRENTSERIES,
} from "../actions/movies";
const initialState = {
  availableMovies: [],
  watchList: [],
  movie: [],
  currentSeries: [],
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
    case SET_MOVIE:
      return { ...state, movie: payload };
    case SET_CURRENTSERIES:
      return { ...state, currentSeries: payload };
    default:
      return state;
  }
};

export default moviesReducer;
