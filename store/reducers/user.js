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
} from "../actions/user";
const initialState = {
  isProfile: false,
  profileName: null,
  user: [],
  profile: {
    watched: [],
    watchList: [],
  },
  email: "",
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
      return { ...state, user: payload };
    case GET_USER_FAILED:
      return { ...state };
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
      return { ...state, user: payload };
    case UPDATE_WATCHED_FAILED:
      return { ...state };
    case ADD_PROFILE:
      return { ...state, profileName: payload };
    case ADD_PROFILE_SUCCESS:
      return { ...state, user: payload, isProfile: true };
    case ADD_PROFILE_FAILED:
      return { ...state, isProfile: false, profileName: null };
    case ADD_PROFILE_DETAILS:
      return { ...state, profile: payload };
    case ADD_TO_WATCHED_PROFILE:
      return { ...state };
    case ADD_TO_WATCHED_PROFILE_SUCCESS:
      return { ...state, user: payload };
    case ADD_TO_WATCHED_PROFILE_FAILED:
      return { ...state };
    case ADD_PROFILE_WATCHED_DETAILS:
      return { ...state, profile: payload };
    case SET_PROFILE:
      return { ...state, isProfile: true, profileName: payload };
    case SET_NOT_PROFILE:
      return { ...state, isProfile: false, profileName: "" };
    case SET_EMAIL:
      return { ...state, email: payload };
    default:
      return state;
  }
};

export default userReducer;
