import {
  ADD_USER,
  ADD_USER_SUCCESS,
  ADD_USER_FAILED,
  GET_USER,
  GET_USER_SUCCESS,
  GET_USER_FAILED,
  ADD_TO_WATCHLIST,
  ADD_TO_WATCHLIST_SUCCESS,
  ADD_TO_WATCHLIST_FAILED,
  REMOVE_FROM_WATCHLIST,
  REMOVE_FROM_WATCHLIST_SUCCESS,
  REMOVE_FROM_WATCHLIST_FAILED,
  ADD_TO_WATCHED,
  ADD_TO_WATCHED_SUCCESS,
  ADD_TO_WATCHED_FAILED,
  UPDATE_WATCHED,
  UPDATE_WATCHED_SUCCESS,
  UPDATE_WATCHED_FAILED,
  ADD_PROFILE,
  ADD_PROFILE_SUCCESS,
  ADD_PROFILE_FAILED,
  ADD_PROFILE_DETAILS,
  ADD_TO_WATCHED_PROFILE,
  ADD_TO_WATCHED_PROFILE_SUCCESS,
  ADD_TO_WATCHED_PROFILE_FAILED,
  ADD_PROFILE_WATCHED_DETAILS,
  SET_PROFILE,
  SET_NOT_PROFILE,
  SET_EMAIL,
  UPDATE_USER_IMAGE,
  UPDATE_USER_IMAGE_SUCCESS,
  UPDATE_USER_IMAGE_FAILED,
  UPDATE_PROFILE,
  UPDATE_PROFILE_SUCCESS,
  UPDATE_PROFILE_FAILED,
  UPDATE_MOVIE_TIME,
  REMOVE_PROFILE,
  REMOVE_PROFILE_SUCCESS,
  REMOVE_PROFILE_FAILED,
  CURRENT_PROFILE,
  LOGGED_IN_SUCCESS,
  LOGGED_OUT_SUCCESS,
  FILLING_PROFILE,
  GET_ALL_USERS,
  GET_ALL_USERS_SUCCESS,
  GET_ALL_USERS_FAILED,
  GET_ALL_WATCHED_MOVIES,
  SELECTING_PROFILE,
} from "../actions/user";
const initialState = {
  profileName: null,
  userFetched: false,
  user: [],
  profile: {
    watched: [],
    watchList: [],
  },
  currentProfile: [],
  email: "",
  watchedAt: 0,
  duration: 0,
  isLoggedIn: "",
  allUsers: [],
  allWatchedMovies: [],
};

const userReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case ADD_USER:
      return { ...state };
    case ADD_USER_SUCCESS:
      return { ...state, user: payload };
    case ADD_USER_FAILED:
      return { ...state };
    case GET_USER:
      return { ...state };
    case GET_USER_SUCCESS:
      return { ...state, user: payload, userFetched: true };
    case GET_USER_FAILED:
      return { ...state, userFetched: false };
    case ADD_TO_WATCHLIST:
      return { ...state };
    case ADD_TO_WATCHLIST_SUCCESS:
      return { ...state, user: payload };
    case ADD_TO_WATCHLIST_FAILED:
      return { ...state };
    case REMOVE_FROM_WATCHLIST:
      return { ...state };
    case REMOVE_FROM_WATCHLIST_SUCCESS:
      return { ...state, user: payload };
    case REMOVE_FROM_WATCHLIST_FAILED:
      return { ...state };
    case ADD_TO_WATCHED:
      return { ...state };
    case ADD_TO_WATCHED_SUCCESS:
      return { ...state, user: payload };
    case ADD_TO_WATCHED_FAILED:
      return { ...state };
    case UPDATE_WATCHED:
      return { ...state };
    case UPDATE_WATCHED_SUCCESS:
      return { ...state, currentProfile: payload };
    case UPDATE_WATCHED_FAILED:
      return { ...state };
    case ADD_PROFILE:
      return { ...state, profileName: payload };
    case ADD_PROFILE_SUCCESS:
      return { ...state, user: payload, isProfile: true };
    case ADD_PROFILE_FAILED:
      return { ...state, profileName: null };
    case ADD_PROFILE_DETAILS:
      return { ...state, currentProfile: payload };
    case ADD_TO_WATCHED_PROFILE:
      return { ...state };
    case ADD_TO_WATCHED_PROFILE_SUCCESS:
      return { ...state, currentProfile: payload };
    case ADD_TO_WATCHED_PROFILE_FAILED:
      return { ...state };
    case ADD_PROFILE_WATCHED_DETAILS:
      return { ...state, currentProfile: payload };
    case SET_PROFILE:
      return { ...state, profileName: payload };
    case SET_NOT_PROFILE:
      return { ...state, profileName: "" };
    case SET_EMAIL:
      return { ...state, email: payload };
    case UPDATE_USER_IMAGE:
      return { ...state };
    case UPDATE_USER_IMAGE_SUCCESS:
      return { ...state, user: payload };
    case UPDATE_USER_IMAGE_FAILED:
      return { ...state };
    case UPDATE_PROFILE:
      return { ...state };
    case UPDATE_PROFILE_SUCCESS:
      return { ...state, user: payload };
    case UPDATE_PROFILE_FAILED:
      return { ...state };
    case REMOVE_PROFILE:
      return { ...state };
    case REMOVE_PROFILE_SUCCESS:
      return { ...state, currentProfile: payload };
    case REMOVE_PROFILE_FAILED:
      return { ...state };
    case UPDATE_MOVIE_TIME:
      return {
        ...state,
        watchedAt: payload.watched,
        duration: payload.duration,
      };
    case CURRENT_PROFILE:
      return { ...state, currentProfile: payload };
    case LOGGED_IN_SUCCESS:
      return { ...state, isLoggedIn: "loggedIn" };
    case LOGGED_OUT_SUCCESS:
      return { ...state, isLoggedIn: "loggedOut" };
    case FILLING_PROFILE:
      return { ...state, isLoggedIn: "signedUp" };
    case SELECTING_PROFILE:
      return { ...state, isLoggedIn: "selectingProfile" };
    case GET_ALL_USERS_SUCCESS:
      return { ...state, allUsers: payload };
    case GET_ALL_WATCHED_MOVIES:
      return { ...state, allWatchedMovies: payload };
    default:
      return state;
  }
};

export default userReducer;
