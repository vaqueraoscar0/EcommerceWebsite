import React, {useEffect, useState} from "react";
import {Form, Button, Col, Row, ListGroup, Image, Card} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import Message from "../components/Message";
import Loader from "../components/Loader";
import {Link} from "react-router-dom";
import {getOrderDetails, payOrder, deliveredOrder} from "../actions/orderActions";
import {PayPalButton} from "react-paypal-button-v2";
import {ORDER_PAY_RESET, ORDER_DELIVERED_RESET} from "../constants/orderConstant";

function OrderScreen({match, history}){
    const orderId = match.params.id;
    const dispatch = useDispatch()

    const [sdkReady, setSdkReady] = useState(false)

    const orderDetails = useSelector(state => state.orderDetails)
    const {order, error, loading} = orderDetails

    const orderPay = useSelector(state => state.orderPay)
    const {loading: loadingPay, success: successPay} = orderPay

    const orderDeliver = useSelector(state => state.orderDeliver)
    const {loading: loadingDeliver, success: successDeliver} = orderDeliver

    const userLogin = useSelector(state => state.userLogin)
    const {userInfo} = userLogin

    if(!loading && !error){
        order.itemsPrice = order.orderItems.reduce((acc,item) => acc + item.price * item.qty, 0).toFixed(2)
    }

    // AYsn1JsqrqzUfCnn7QycCfnYNfARB8lqdFCcWQQUy_iSXnc75AxPOwdE0-r6bYCRkWtUjQL_COAN9rzo

    const addPayPalScript = () =>{
        const id_ = 'AYsn1JsqrqzUfCnn7QycCfnYNfARB8lqdFCcWQQUy_iSXnc75AxPOwdE0-r6bYCRkWtUjQL_COAN9rzo'
        const script = document.createElement('script');
        script.type= 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${id_}`
        script.async = true
        script.onload = () =>{
            setSdkReady(true)
        }

        document.body.appendChild(script)
    }

    useEffect(() =>{
        if(!userInfo){
            history.push('/login')
        }

        if(!order || successPay || order._id !== Number(orderId) || successDeliver) {
            dispatch({type: ORDER_PAY_RESET})
            dispatch({type: ORDER_DELIVERED_RESET})

            dispatch(getOrderDetails(orderId))
        }else if(!order.isPaid){
            if(!window.paypal){
                addPayPalScript()
            }else{
                setSdkReady(true)
            }
        }
    }, [dispatch, order, orderId, successPay, successDeliver])

    const successPaymentHandler = (paymentResult) =>{
        dispatch(payOrder(orderId, paymentResult))
    }

    const deliverHandler = () =>{
        dispatch(deliveredOrder(order))
    }

    return loading ? (
        <Loader/>
    ) : error ? (
        <Message variant={'danger'}>{error}</Message>
    ) : (
        <div>
            <h1>Order: {order._id}</h1>
            <Row>
                <Col md={8}>
                        <ListGroup variant={'flush'}>
                            <ListGroup.Item>

                            <h2>SHIPPING</h2>
                            <p><strong>Name:</strong> {order.user.name}</p>
                                <p><strong>Email:</strong> <a href={`mailto: ${order.user.email}`}>{order.user.email}</a></p>

                                <p>
                                    <strong>Shipping: </strong>
                                    {order.shippingAddress.address}, {order.shippingAddress.city}
                                    {'   '}
                                    {order.shippingAddress.postalCode}
                                    {'   '}
                                    {order.shippingAddress.country}
                                </p>

                                {order.isDelivered ? (
                                    <Message variant={'success'}>Delivered on {order.deliveredAt}</Message>
                                ): (
                                    <Message variant={'warning'}>Not Delivered</Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item variant={'flush'}>
                                <h2>Payment Method</h2>
                                <p>
                                    <strong>Method: </strong>
                                    {order.paymentMethod}
                                </p>
                                {order.isPaid ? (
                                    <Message variant={'success'}>Paid on {order.paidAt}</Message>
                                ): (
                                    <Message variant={'warning'}>Not Paid</Message>
                                )}
                            </ListGroup.Item>

                            <ListGroup.Item variant={'flush'}>
                                <h2>Order Items</h2>
                                {order.orderItems.length === 0 ? <Message variant={'info'}>
                                    Your order is empty
                                </Message> : (
                                    <ListGroup variant={'flush'}>
                                        {order.orderItems.map((item, index) =>(
                                            <ListGroup.Item key={index}>
                                                <Row>
                                                    <Col md={1}>
                                                        <Image src={item.image} alt={item.name} fluid={true} rounded={true}/>
                                                    </Col>
                                                    <Col>
                                                        <Link to={`/product/${item.product}`}>{item.name}</Link>
                                                    </Col>
                                                    <Col md={4}>
                                                        {item.qty} X ${item.price} = ${(item.qty * item.price).toFixed(2)}
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        ))}
                                    </ListGroup>
                                )}
                            </ListGroup.Item>

                        </ListGroup>
                </Col>
                <Col md={4}>
                    <Card>
                        <ListGroup variant={'flush'}>
                            <ListGroup.Item>
                                <h2>ORDER SUMMARY</h2>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Items: </Col>
                                    <Col>${order.itemsPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Shipping: </Col>
                                    <Col>${order.shippingPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Tax: </Col>
                                    <Col>${order.taxPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            <ListGroup.Item>
                                <Row>
                                    <Col>Total: </Col>
                                    <Col>${order.totalPrice}</Col>
                                </Row>
                            </ListGroup.Item>

                            {!order.isPaid && (
                                <ListGroup.Item>
                                    {loadingPay && <Loader/>}
                                    {!sdkReady ? (
                                        <Loader/>
                                    ) :(
                                        <PayPalButton
                                            amount={order.totalPrice}
                                            onSuccess={successPaymentHandler}
                                        />
                                    )}
                                </ListGroup.Item>
                            )}
                        </ListGroup>
                        {loadingDeliver && <Loader/>}
                        {userInfo && userInfo.isAdmin && order.isPaid && !order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                    type={'button'}
                                    className={'btn btn-block'}
                                    onClick={deliverHandler}
                                >
                                    Mark As Deliver
                                </Button>
                            </ListGroup.Item>
                        ) }


                    </Card>
                </Col>
            </Row>
        </div>
    )
}

export default OrderScreen