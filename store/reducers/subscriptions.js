import {
  GET_STRIPE_PRICES,
  GET_STRIPE_PRICES_SUCCESS,
  GET_STRIPE_PRICES_FAILED,
  GET_MY_SUBSCRIPTION,
  GET_MY_SUBSCRIPTION_SUCCESS,
  GET_MY_SUBSCRIPTION_FAILED,
} from "../actions/subscriptions";
const initialState = {
  isFetching: false,
  subscriptions: [],
  mySubscriptions: [],
};

const subscriptionReducer = (state = initialState, { type, payload }) => {
  switch (type) {
    case GET_STRIPE_PRICES:
      return { ...state, isFetching: true };
    case GET_STRIPE_PRICES_SUCCESS:
      return { ...state, subscriptions: payload, isFetching: false };
    case GET_STRIPE_PRICES_FAILED:
      return { ...state, isFetching: false };
    case GET_MY_SUBSCRIPTION:
      return { ...state, isFetching: true };
    case GET_MY_SUBSCRIPTION_SUCCESS:
      return { ...state, mySubscriptions: payload, isFetching: false };
    case GET_MY_SUBSCRIPTION_FAILED:
      return { ...state, isFetching: false };
    default:
      return state;
  }
};

export default subscriptionReducer;
