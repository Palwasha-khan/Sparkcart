import React, { useEffect, useState } from 'react'
import MetaData from '../layout/Metadata'
import CheckoutSteps from './CheckoutSteps'
import { useSelector } from 'react-redux'
import { calculateOrderCost } from '../../helpers/helpers'
import {useCreateNewOrderMutation} from "../../redux/api/orderApi"
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'

const PaymentMethod = () => {
    const [method,setMethod] = useState("")
    
    const {cartItems,shippingInfo} = useSelector((state) => state.cart)

    const [createNewOrder ,{isLoading, error,isSuccess }] = useCreateNewOrderMutation()
    const {itemsPrice,shippingPrice,taxPrice,totalPrice,} = 
       calculateOrderCost(cartItems)
    const navigate = useNavigate();
        
         useEffect(() => {
    
          if(isSuccess){ 
             toast.success( "order Confirmed");
            navigate("/");
          }
            if (error) {
              toast.error(error?.data?.message || 'Something went wrong')
            }
          }, [error,isSuccess ])
    

    const submitHandler = (e) =>{
        e.preventDefault(); 

        if(method == "COD"){   
              const orderItemsWithImages = cartItems.map(item => ({
              product: item._id || item.product,   // required by backend
              name: item.name,
              price: item.price,
              quantity: item.quantity,
              images: typeof item.images === "string" ? item.images : item.image || "https://via.placeholder.com/150"
            }));

              const orderData = {
                shippingInfo,
                orderItems:orderItemsWithImages,
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
        if(method == "Card"){
            
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

          <button id="shipping_btn" type="submit" className="btn py-2 w-100" disabled={!method}>
            CONTINUE
          </button>
        </form>
      </div>
    </div>
     </>
  )
}

export default PaymentMethod