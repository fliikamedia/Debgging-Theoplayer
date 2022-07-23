import { Provider as StoreProvider } from "react-redux";
import moviesReducer from "./reducers/movies";
import userReducer from "./reducers/user";
import subscriptionReducer from "./reducers/subscriptions";
import reduxThunk from "redux-thunk";
import { createStore, combineReducers, applyMiddleware } from "redux";
import { persistReducer, persistStore } from "redux-persist";
import AsyncStorage from "@react-native-community/async-storage";

const rootReducer = combineReducers({
  user: userReducer,
  movies: moviesReducer,
  subscriptions: subscriptionReducer,
});
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = createStore(persistedReducer, applyMiddleware(reduxThunk));
export const persistor = persistStore(store);
