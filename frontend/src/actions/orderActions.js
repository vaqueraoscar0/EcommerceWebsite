import axios from "axios";
import {CART_CLEAR_ITEMS} from "../constants/cartConstants";
import {
    ORDER_CREATE_FAIL,
    ORDER_CREATE_REQUEST,
    ORDER_CREATE_SUCCESS
} from "../constants/orderConstant";




export const createOrder = (order) => async (dispatch, getState) =>{
    try{
        dispatch({
            type: ORDER_CREATE_REQUEST
        })

        console.log(order)

        const {
            userLogin: {userInfo},
        } = getState()

        const config = {
            headers: {
                'content-type': 'application/json',
                Authorization: `Bearer ${userInfo.token}`
            }
        }

        const {data} = await axios.post(
            `/api/orders/add/`,
            order,
            config,
        )

        dispatch({
            type:ORDER_CREATE_SUCCESS,
            payload: data,
        })

        dispatch({
            type: CART_CLEAR_ITEMS,
            payload: data
        })

        localStorage.removeItem('cartItems');

    } catch(error){
        dispatch({
            type: ORDER_CREATE_FAIL,
            payload: error.respond && error.respond.data.detail
            ? error.respond.data.detail
            : error.message
        })
    }
}
