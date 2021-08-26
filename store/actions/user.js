import axios from "axios";
import expressApi from "../../src/api/expressApi";

export const ADD_USER = "ADD_USER";
export const ADD_USER_SUCCESS = "ADD_USER_SUCCESS";
export const ADD_USER_FAILED = "ADD_USER_FAILED";
export const GET_USER = "GET_USER";
export const GET_USER_SUCCESS = "GET_USER_SUCCESS";
export const GET_USER_FAILED = "GET_USER_FAILED";
export const ADD_TO_WATCHLIST = "ADD_TO_WATCHLIST";
export const ADD_TO_WATCHLIST_SUCCESS = "ADD_TO_WATCHLIST_SUCCESS";
export const ADD_TO_WATCHLIST_FAILED = "ADD_TO_WATCHLIST_FAILED";
export const REMOVE_FROM_WATCHLIST = "REMOVE_FROM_WATCHLIST";
export const REMOVE_FROM_WATCHLIST_SUCCESS = "REMOVE_FROM_WATCHLIST_SUCCESS";
export const REMOVE_FROM_WATCHLIST_FAILED = "REMOVE_FROM_WATCHLIST_FAILED";
export const ADD_TO_WATCHED = "ADD_TO_WATCHED";
export const ADD_TO_WATCHED_SUCCESS = "ADD_TO_WATCHED_SUCCESS";
export const ADD_TO_WATCHED_FAILED = "ADD_TO_WATCHED_FAILED";
export const UPDATE_WATCHED = "UPDATE_WATCHED";
export const UPDATE_WATCHED_SUCCESS = "UPDATE_WATCHED_SUCCESS";
export const UPDATE_WATCHED_FAILED = "UPDATE_WATCHED_FAILED";
export const ADD_PROFILE = "ADD_PROFILE";
export const ADD_PROFILE_SUCCESS = "ADD_PROFILE_SUCCESS";
export const ADD_PROFILE_FAILED = "ADD_PROFILE_FAILED";
export const ADD_PROFILE_DETAILS = "ADD_PROFILE_DETAILS";
export const ADD_TO_WATCHED_PROFILE = "ADD_TO_WATCHED_PROFILE";
export const ADD_TO_WATCHED_PROFILE_SUCCESS = "ADD_TO_WATCHED_PROFILE_SUCCESS";
export const ADD_TO_WATCHED_PROFILE_FAILED = "ADD_TO_WATCHED_PROFILE_FAILED";
export const ADD_PROFILE_WATCHED_DETAILS = "ADD_PROFILE_WATCHED_DETAILS";
export const SET_PROFILE = "SET_PROFILE";
export const SET_NOT_PROFILE = "SET_NOT_PROFILE";
export const SET_EMAIL = "SET_EMAIL";
export const UPDATE_USER_IMAGE = "UPDATE_USER_IMAGE";
export const UPDATE_USER_IMAGE_SUCCESS = "UPDATE_USER_IMAGE_SUCCESS";
export const UPDATE_USER_IMAGE_FAILED = "UPDATE_USER_IMAGE_FAILED";
export const UPDATE_PROFILE = "UPDATE_PROFILE";
export const UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS";
export const UPDATE_PROFILE_FAILED = "UPDATE_PROFILE_FAILED";
export const UPDATE_MOVIE_TIME = 'UPDATE_MOVIE_TIME';

export const addUser = (email, fullName, profileImage) => async (dispatch) => {
  try {
    dispatch({ type: ADD_USER });
    const result = await expressApi.post(`/users`, {
      email: email,
      fullName: fullName,
      profileImage: profileImage,
    });
    if (result.status == 201) {
      console.log(result.data);
      dispatch({
        type: ADD_USER_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({ type: ADD_USER_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const getUser = (email, profileName) => async (dispatch) => {
  try {
    dispatch({ type: GET_USER });
    const result = await expressApi.post(`/users/a`, {
      email: email,
    });
    if (result.status == 200) {
      // console.log(result.data);

      dispatch({
        type: GET_USER_SUCCESS,
        payload: result.data,
      });
      if (profileName) {
        dispatch({
          type: ADD_PROFILE_WATCHED_DETAILS,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      }
    } else {
      dispatch({ type: GET_USER_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const addToWatchList = (emails, movie) => async (dispatch) => {
  try {
    dispatch({ type: ADD_TO_WATCHLIST });
    const result = await expressApi.put(`/users`, {
      email: emails,
      newMovie: { title: movie.title },
    });
    if (result.status == 200) {
      dispatch({
        type: ADD_TO_WATCHLIST_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({ type: ADD_TO_WATCHLIST_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const removeFromWatchList = (emails, movie) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FROM_WATCHLIST });
    const result = await expressApi.patch(`/users/b`, {
      email: emails,
      newMovie: { title: movie.title },
    });
    if (result.status == 200) {
      // console.log(result);
      dispatch({
        type: REMOVE_FROM_WATCHLIST_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({ type: REMOVE_FROM_WATCHLIST_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const addtoWatched =
  (emails, title, duration, watched) => async (dispatch) => {
    console.log('caught movie', title);
    try {
      dispatch({ type: ADD_TO_WATCHED });
      const result = await expressApi.patch(`/users`, {
        email: emails,
        newMovie: {
          title: title,
          duration: duration,
          watchedAt: watched,
        },
      });
      if (result.status == 200) {
        // console.log(result);
        dispatch({
          type: ADD_TO_WATCHED_SUCCESS,
          payload: result.data,
        });
      } else {
        dispatch({ type: ADD_TO_WATCHED_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const updateWatched =
  (emails, title, duration, watched) => async (dispatch) => {
    console.log("updating", duration, watched);
    try {
      dispatch({ type: UPDATE_WATCHED });
      const result = await expressApi.patch(`/users/c`, {
        email: emails,
        newMovie: {
          title: title,
          duration: duration,
          watchedAt: watched,
        },
      });
      if (result.status == 200) {
         //console.log(result);
        dispatch({
          type: UPDATE_WATCHED_SUCCESS,
          payload: result.data,
        });
      } else {
        dispatch({ type: UPDATE_WATCHED_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const addProfile = (emails, name, image) => async (dispatch) => {
  console.log("adding profile");
  try {
    dispatch({ type: ADD_PROFILE, payload: name });
    const result = await expressApi.post(`/users/profile`, {
      email: emails,
      profile: {
        name: name,
        image: image,
        watched: [],
        watchList: [],
      },
    });
    if (result.status == 200) {
      // console.log(result.data);
      dispatch({
        type: ADD_PROFILE_SUCCESS,
        payload: result.data,
      });
      dispatch({
        type: ADD_PROFILE_DETAILS,
        payload: result.data.profiles.find((r) => r.name == name),
      });
    } else {
      dispatch({ type: ADD_PROFILE_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const addtoWatchedProfile =
  (emails, title, duration, watched, profileName) => async (dispatch) => {
    try {
      console.log("watched profile");
      dispatch({ type: ADD_TO_WATCHED_PROFILE });
      const result = await expressApi.patch(`/users/profile`, {
        email: emails,
        profileName: profileName,
        newMovie: {
          title: title,
          duration: duration,
          watchedAt: watched,
        },
      });
      if (result.status == 200) {
        // console.log(result);
        dispatch({
          type: ADD_TO_WATCHED_PROFILE_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: ADD_PROFILE_WATCHED_DETAILS,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHED_PROFILE_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const setProfile = (name) => async (dispatch) => {
  dispatch({ type: SET_PROFILE, payload: name });
};
export const setNotProfile = () => async (dispatch) => {
  dispatch({ type: SET_NOT_PROFILE });
};

export const updateWatchedProfile =
  (emails, title, duration, watched, profileName) => async (dispatch) => {
    console.log("updating profile");
    try {
      dispatch({ type: UPDATE_WATCHED });
      const result = await expressApi.post(`/users/profile/a`, {
        email: emails,
        profileName: profileName,
        newMovie: {
          title: title,
          duration: duration,
          watchedAt: watched,
        },
      });
      if (result.status == 200) {
        console.log("result", result.data);
        dispatch({
          type: UPDATE_WATCHED_SUCCESS,
          payload: result.data,
        });

        dispatch({
          type: ADD_PROFILE_WATCHED_DETAILS,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      } else {
        dispatch({ type: UPDATE_WATCHED_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const addToProfileWatchList =
  (emails, movie, profileName) => async (dispatch) => {
    try {
      dispatch({ type: ADD_TO_WATCHLIST });
      const result = await expressApi.post(`/users/profile/b`, {
        email: emails,
        profileName: profileName,
        newMovie: { title: movie.title },
      });
      if (result.status == 200) {
        dispatch({
          type: ADD_TO_WATCHLIST_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: ADD_PROFILE_WATCHED_DETAILS,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      } else {
        dispatch({ type: ADD_TO_WATCHLIST_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const removeFromProfileWatchList =
  (emails, movie, profileName) => async (dispatch) => {
    try {
      dispatch({ type: REMOVE_FROM_WATCHLIST });
      const result = await expressApi.post(`/users/profile/c`, {
        email: emails,
        profileName: profileName,
        newMovie: { title: movie.title },
      });
      if (result.status == 200) {
        console.log(result);
        dispatch({
          type: REMOVE_FROM_WATCHLIST_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: ADD_PROFILE_WATCHED_DETAILS,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      } else {
        dispatch({ type: REMOVE_FROM_WATCHLIST_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

export const removeProfile = (emails, profileName) => async (dispatch) => {
  try {
    dispatch({ type: REMOVE_FROM_WATCHLIST });
    const result = await expressApi.post(`/users/profile/d`, {
      email: emails,
      profileName: profileName,
    });
    if (result.status == 200) {
      // console.log(result);
      dispatch({
        type: REMOVE_FROM_WATCHLIST_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({ type: REMOVE_FROM_WATCHLIST_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const setEmailFunc = (email) => (dispatch) => {
  try {
    dispatch({ type: SET_EMAIL, payload: email });
  } catch (err) {}
};

export const updateUserImage = (email, profileImage) => async (dispatch) => {
  try {
    dispatch({ type: UPDATE_USER_IMAGE });
    const result = await expressApi.post(`/users/e`, {
      email: email,
      profileImage: profileImage,
    });
    if (result.status == 200) {
      // console.log(result);
      dispatch({
        type: UPDATE_USER_IMAGE_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({ type: UPDATE_USER_IMAGE_FAILED });
    }
  } catch (err) {
    console.log(err);
  }
};

export const updateProfile =
  (emails, profileName, newName, profileImage) => async (dispatch) => {
    try {
      dispatch({ type: UPDATE_PROFILE });
      const result = await expressApi.post(`/users/profile/g`, {
        email: emails,
        profileName: profileName,
        newName: newName,
        profileImage: profileImage,
      });
      if (result.status == 200) {
        console.log(result);
        dispatch({
          type: UPDATE_PROFILE_SUCCESS,
          payload: result.data,
        });
        dispatch({
          type: UPDATE_PROFILE_FAILED,
          payload: result.data.profiles.find((r) => r.name == profileName),
        });
      } else {
        dispatch({ type: UPDATE_PROFILE_FAILED });
      }
    } catch (err) {
      console.log(err);
    }
  };

  export const updateMovieTime = (watched, duration) => async (dispatch) => {
try {
  console.log('updating time');
dispatch({type: UPDATE_MOVIE_TIME, payload: {watched: watched, duration: duration}})
} catch (err) {}
  }