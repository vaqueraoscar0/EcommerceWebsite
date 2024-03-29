import {createStore, applyMiddleware, combineReducers} from "redux";
import thunk from 'redux-thunk'
import {composeWithDevTools} from "redux-devtools-extension";
import {productListReducers, productDetailsReducers, productDeleteReducers, productCreateReducers, productUpdateReducers, productReviewCreateReducers, productTopRatedReducers} from './reducers/productReducers'
import {cartReducer} from "./reducers/cartReducers";
import {userLoginReducer, userRegisterReducer, userDetailsReducer, userUpdateProfileReducer, userListReducer, userDeleteReducer, userUpdateReducer} from "./reducers/userReducers";
import {
    orderCreateReducer,
    orderDetailReducer,
    orderPayReducer,
    orderListMyReducer,
    orderListReducer,
    orderDeliveredReducer,
} from "./reducers/orderReducers";

const reducer = combineReducers({
    productList: productListReducers,
    productDetails: productDetailsReducers,
    productDelete: productDeleteReducers,
    productCreate: productCreateReducers,
    productUpdate: productUpdateReducers,
    productReviewCreate: productReviewCreateReducers,
    productTopRated: productTopRatedReducers,
    cart: cartReducer,

    userLogin: userLoginReducer,
    userRegister: userRegisterReducer,
    userDetails: userDetailsReducer,
    userUpdateProfile: userUpdateProfileReducer,
    userList: userListReducer,
    userDelete: userDeleteReducer,
    userUpdate: userUpdateReducer,

    orderCreate: orderCreateReducer,
    orderDetails: orderDetailReducer,
    orderPay: orderPayReducer,
    orderDeliver: orderDeliveredReducer,
    orderListMy: orderListMyReducer,
    orderList: orderListReducer,


})

const cartItemsFromStorage = localStorage.getItem('cartItems') ?
    JSON.parse(localStorage.getItem('cartItems')) : []

const userInfoFromStorage = localStorage.getItem('userInfo') ?
    JSON.parse(localStorage.getItem('userInfo')) : null

const shippingAddressFromStorage = localStorage.getItem('shippingAddress') ?
    JSON.parse(localStorage.getItem('shippingAddress')) : {}

const initialState = {
    cart: { cartItems: cartItemsFromStorage, shippingAddress: shippingAddressFromStorage},
    userLogin: {userInfo: userInfoFromStorage},
}

const middleware = [thunk]

const store = createStore(reducer, initialState,
    composeWithDevTools(
        applyMiddleware(...middleware)
    )
)

export default store