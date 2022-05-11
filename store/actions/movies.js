import fliikaApi from "../../src/api/FliikaApi";
import axios from "axios";

export const FETCH_MOVIES = "FETCH_MOVIES";
export const FETCH_MOVIES_SUCCESS = "FETCH_MOVIES_SUCCESS";
export const FETCH_MOVIES_FAILED = "FETCH_MOVIES_FAILED";
export const SET_CURRENTSERIES = "SET_CURRENTSERIES";
export const SET_MOVIE = "SET_MOVIE";

export const fetchMovies = () => {
  return async (dispatch) => {
    dispatch({ type: FETCH_MOVIES });
    const response = await fliikaApi.get("/posts");
    // console.log(response.data);
    if (response.data) {
      // console.log('movies',response.data.length);
      dispatch({ type: FETCH_MOVIES_SUCCESS, payload: response.data });
    } else {
      dispatch({ type: FETCH_MOVIES_FAILED });
    }
  };
};
export const saveMovies = (payload) => (dispatch) => {
  dispatch({ type: FETCH_MOVIES_SUCCESS, payload: payload });
};

export const setMovieTitle = (movie) => (dispatch) => {
  dispatch({ type: SET_MOVIE, payload: movie });
};

export const setCurrentSeries = (currentSeries) => (dispatch) => {
  dispatch({ type: SET_CURRENTSERIES, payload: currentSeries });
};
