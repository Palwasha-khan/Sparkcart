import React, {  useEffect, useState } from 'react'
import MetaData from '../layout/Metadata'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux'
import { calculateOrderCost } from '../../helpers/helpers'
import {useCreateNewOrderMutation, useStripeCheckoutSessionMutation} from "../../redux/api/orderApi"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const PaymentMethod = () => {

    const [method,setMethod] = useState("")
    const {cartItems,shippingInfo} = useSelector((state) => state.cart)
    const [createNewOrder ,{isLoading, error,isSuccess }] = useCreateNewOrderMutation()
    const [stripeCheckoutSession,{data: CheckoutData,error: checkoutError,isLoading: loading}] = useStripeCheckoutSessionMutation()
    const navigate = useNavigate();

    useEffect(() => {
        if(CheckoutData){
          window.location.href = CheckoutData?.url;
        }
        if(checkoutError){
          toast.error(checkoutError?.data?.message || 'Something went wrong during checkout') 
        }
        }, [CheckoutData, checkoutError]);
    
        
    useEffect(() => {
    
          if(isSuccess){ 
             toast.success( "order Confirmed");
             
            navigate("/me/orders?order_success=true");
          }
            if (error) {
              toast.error(error?.data?.message || 'Something went wrong')
            }
          }, [error,isSuccess ])
    

    const submitHandler = (e) =>{
        e.preventDefault(); 

        const {itemsPrice,shippingPrice,taxPrice,totalPrice,} =  calculateOrderCost(cartItems)
   

        if(method === "COD"){   

              const orderData = {
                shippingInfo,
                 orderItems: cartItems.map(item => ({
                    product: item._id || item.product,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    images: item.image || item.images || "https://via.placeholder.com/150", // ✅ REQUIRED
                })),
                itemsPrice,
                taxAmount:taxPrice,
                ShippingAmount:shippingPrice,
                totalAmount:totalPrice,
                paymentInfo:{
                    status:"Not Paid"
                },
                paymentMethod:"COD",
            }
             console.log("Order data being sent:", orderData); 
            createNewOrder(orderData);

        }
        if(method === "Card"){
            const orderData = {
                shippingInfo,
                orderItems: cartItems.map(item => ({
                    product: item._id || item.product,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    images: item.image || item.images || "https://via.placeholder.com/150", // ✅ REQUIRED
                })),
                itemsPrice,
                taxAmount:taxPrice,
                ShippingAmount:shippingPrice,
                totalAmount:totalPrice,      
            }

            stripeCheckoutSession(orderData)
        }
    }

  return (
     <>
     <MetaData title={'Payment Method '}/>
     <CheckoutSteps shipping confirmOrder payment/>
      <div className="row wrapper">
      <div className="col-10 col-lg-5">
        <form
          className="shadow rounded bg-body" onSubmit={submitHandler}>
          <h2 className="mb-4">Select Payment Method</h2>

          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="codradio"
              value="COD"
              onChange={(e)=>setMethod("COD")}
            />
            <label className="form-check-label" htmlFor="codradio">
              Cash on Delivery
            </label>
          </div>
          <div className="form-check">
            <input
              className="form-check-input"
              type="radio"
              name="payment_mode"
              id="cardradio"
              value="Card"
              onChange={(e)=>setMethod("Card")}
            />
            <label className="form-check-label" htmlFor="cardradio">
              Card - VISA, MasterCard
            </label>
          </div>

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={loading || method === ""}>
            CONTINUE
          </button>
        </form>
      </div>
    </div>
     </>
  )
}

export default PaymentMethod