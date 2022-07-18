import expressApi from "../../src/api/expressApi";

export const GET_STRIPE_PRICES = "GET_STRIPE_PRICES";
export const GET_STRIPE_PRICES_SUCCESS = "GET_STRIPE_PRICES_SUCCESS";
export const GET_STRIPE_PRICES_FAILED = "GET_STRIPE_PRICES_FAILED";
export const GET_MY_SUBSCRIPTION = "GET_MY_SUBSCRIPTION";
export const GET_MY_SUBSCRIPTION_SUCCESS = "GET_MY_SUBSCRIPTION_SUCCESS";
export const GET_MY_SUBSCRIPTION_FAILED = "GET_MY_SUBSCRIPTION_FAILED";

export const getStripePrices = () => async (dispatch) => {
  try {
    dispatch({ type: GET_STRIPE_PRICES });
    const result = await expressApi.get("/subs/prices");
    // console.log(result.data);
    if (result.status === 200) {
      dispatch({
        type: GET_STRIPE_PRICES_SUCCESS,
        payload: result.data,
      });
    } else {
      dispatch({
        type: GET_STRIPE_PRICES_FAILED,
        payload: result.data,
      });
    }
  } catch (err) {
    console.log(err);
    dispatch({
      type: GET_STRIPE_PRICES_FAILED,
      payload: result.data,
    });
  }
};

export const createSubscription =
  (customerId, priceId, tokenId) => async (dispatch) => {
    try {
      const result = await expressApi.post(
        "/mobile-subs/create-subscription",
        {
          customerId: customerId,
          priceId: priceId,
        },
        {
          headers: {
            authtoken: tokenId,
          },
        }
      );

      // console.log(result.data);
    } catch (err) {
      console.log(err);
    }
  };
export const getSubscriptions = (customerId, tokenId) => async (dispatch) => {
  try {
    dispatch({ type: GET_MY_SUBSCRIPTION });
    const result = await expressApi.post(
      "/mobile-subs/get-subscriptions",
      {
        customerId: customerId,
      },
      {
        headers: {
          authtoken: tokenId,
        },
      }
    );
    if (result.status === 200) {
      dispatch({ type: GET_MY_SUBSCRIPTION_SUCCESS, payload: result.data });
    } else {
      dispatch({ type: GET_MY_SUBSCRIPTION_FAILED });
    }
    // console.log(result.data.subscriptions.data);
  } catch (err) {
    console.log(err);
    dispatch({ type: GET_MY_SUBSCRIPTION_FAILED });
  }
};

export const cancelSubscription =
  (subscriptionId, tokenId) => async (dispatch) => {
    try {
      const result = await expressApi.post(
        "/mobile-subs/cancel-subscriptions",
        {
          subscriptionId: subscriptionId,
        },
        {
          headers: {
            authtoken: tokenId,
          },
        }
      );
      // console.log(result);
    } catch (err) {
      console.log(err);
    }
  };
