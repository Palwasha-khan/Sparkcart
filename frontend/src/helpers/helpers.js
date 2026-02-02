export const getPriceQueryParams = (searchParams, key, value) => {
   
  searchParams.delete('min')
  searchParams.delete('max')

  if (value && Number(value) > 0) {
    if (key === 'min') {
      searchParams.set('price[gte]', value)
    }

    if (key === 'max') {
      searchParams.set('price[lte]', value)
    }
  } else {
    if (key === 'min') searchParams.delete('price[gte]')
    if (key === 'max') searchParams.delete('price[lte]')
  }

  return searchParams
}

export const calculateOrderCost = (cartItems) => {
  const itemsPrice = cartItems?.reduce(
    (acc,item) => acc + item.price * item.quantity,
    0
  );

  const shippingPrice = itemsPrice > 200 ? 0 : 25;
  const taxPrice = Number((0.15 * itemsPrice).toFixed(2));
  const totalPrice = (itemsPrice + shippingPrice +taxPrice).toFixed(2)

  return{
    itemsPrice:Number(itemsPrice).toFixed(2)
    ,shippingPrice,taxPrice,totalPrice,
  }
}
