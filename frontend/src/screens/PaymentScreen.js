import React, {useState, useEffect} from "react";
import {Form, Button, Col} from "react-bootstrap";
import {useDispatch, useSelector} from "react-redux";
import FormContainer from "../components/FormContainer";
import CheckoutSteps from "../components/CheckoutSteps";
import {savePaymentMethod} from "../actions/cartActions";


function PaymentScreen({history}){
    const cart = useSelector(state => state.cart)
    const {shippingAddress} = cart

    const dispatch = useDispatch()

    const [paymentMethod, setPaymentMethod] = useState('Paypal')

    if(!shippingAddress.address){
        history.push('/shipping');
    }

    const submitHandler = (e) =>{
        e.preventDefault()
        dispatch(savePaymentMethod(paymentMethod));
        history.push('/placeorder')
    }

    return(
        <FormContainer>
            <CheckoutSteps step1 step2 step3/>
            <Form onSubmit={submitHandler}>
                <Form.Group>
                    <Form.Label as={'legend'}>Select Method</Form.Label>
                    <Col>
                        <Form.Check
                            type={'radio'}
                            label={'Paypal or Credit Card'}
                            id={'paypal'}
                            name={'paymentMethod'}
                            checked={true}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                        />
                    </Col>
                </Form.Group>

                <Button type={'submit'} variant={'primary'}>Continue</Button>
            </Form>
        </FormContainer>
    )
}

export default PaymentScreen