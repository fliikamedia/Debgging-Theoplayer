import fliikaApi from "../../src/api/FliikaApi";
import axios from "axios";

export const FETCH_MOVIES = "FETCH_MOVIES";
export const FETCH_MOVIES_SUCCESS = "FETCH_MOVIES_SUCCESS";
export const FETCH_MOVIES_FAILED = "FETCH_MOVIES_FAILED";

export const fetchMovies = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MOVIES });
    const response = await fliikaApi.get("/posts");
    // console.log(response.data);
    if (response.data) {
      dispatch({ type: FETCH_MOVIES_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FETCH_MOVIES_FAILED });
    }
  };
};
export const saveMovies = (payload) => (dispatch) => {
  dispatch({ type: FETCH_MOVIES_SUCCESS, payload: payload });
};
