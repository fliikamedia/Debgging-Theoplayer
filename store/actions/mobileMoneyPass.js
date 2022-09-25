export const ADD_MOBILE_PASS_DETAILS = "ADD_MOBILE_PASS_DETAILS";
export const ADD_MOBILE_PASS_DETAILS_SUCCESS =
  "ADD_MOBILE_PASS_DETAILS_SUCCESS";
export const ADD_MOBILE_PASS_DETAILS_FAILED = "ADD_MOBILE_PASS_DETAILS_FAILED";
import { GET_USER_SUCCESS, CURRENT_PROFILE } from "./user";
import expressApi from "../../src/api/expressApi";

export const addMomoPassDetails =
  (userId, momo_data, plan, momo_pass_exp, authToken) => async (dispatch) => {
    console.log(userId, momo_data, plan, momo_pass_exp, authToken);
    try {
      let headers = {
        authtoken: authToken,
      };
      dispatch({ type: ADD_MOBILE_PASS_DETAILS });

      const result = await expressApi.post(
        "/momoPass/post-momo-data",
        {
          userId,
          momo_data,
          plan,
          momo_pass_exp,
        },
        {
          headers: headers,
        }
      );

      if (result?.status === 200) {
        // console.log("result momo", result?.data);
        dispatch({ type: ADD_MOBILE_PASS_DETAILS_SUCCESS });
        dispatch({
          type: GET_USER_SUCCESS,
          payload: result.data,
        });

        dispatch({
          type: CURRENT_PROFILE,
          payload: result?.data?.profiles[0],
        });
      } else {
        dispatch({ type: ADD_MOBILE_PASS_DETAILS_FAILED });
      }
    } catch (err) {
      dispatch({ type: ADD_MOBILE_PASS_DETAILS_FAILED });
    }
  };
