import React, {useEffect, useState} from 'react'
import { useProduct } from 'vtex.product-context'

import {useQuery} from 'react-apollo'
//import {useQuery, useLazyQuery } from 'react-apollo'

import getOrderForm from './graphql/getOrderForm.gql'

import { canUseDOM } from 'vtex.render-runtime'

import {PixelMessage,} from './typings/events'


interface QuantityOnCartProps {
}

const QuantityOnCart: StorefrontFunctionComponent<QuantityOnCartProps> = ({}) => {
  const productContextValue = useProduct()
  const productId = productContextValue?.product?.items[0]?.itemId
  const [itemQuantity, setItemQuantity]: any = useState(null)

  const selectedQuantity = productContextValue?.selectedQuantity
  //const buyButton = productContextValue?.buyButton

  const [itemsCartUpdate, setItemsCartUpdate]: any = useState(null)

  const { loading: loadingGetOrderForm, error: errorGetOrderForm, data: dataGetOrderForm } = useQuery(getOrderForm)
  
  function handleEvents(e: PixelMessage) {
    switch (e.data.eventName) {
      case 'vtex:addToCart': {
        setItemsCartUpdate(e.data)        
        return
      }
      default: {
        break
      }
    }
  }
  
  if (canUseDOM) {
    window.addEventListener('message', handleEvents)
  }

  useEffect ( () => {
    if(loadingGetOrderForm){
      console.log("loadingGetOrderOrderForm",loadingGetOrderForm)
    }
    if(errorGetOrderForm){
      console.log("errorGetOrderOrderForm",errorGetOrderForm)
    }
    if(dataGetOrderForm){
      const itemsOrderForm = dataGetOrderForm.orderForm.items
      const itemFound = itemsOrderForm?.find((element: { id: any }) => element.id == productId);
      setItemQuantity(itemFound?.quantity)
    }
  },[loadingGetOrderForm,errorGetOrderForm,dataGetOrderForm]
  )

  useEffect ( () => {
    if(itemsCartUpdate){
      const itemsOrderForm = itemsCartUpdate.items
      const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId == productId);
      setItemQuantity(itemFound?.quantity)
      //setItemsCartUpdate(null)        
    }
  },[itemsCartUpdate]
  )

  /*useEffect ( () => {
    if(buyButton.clicked){
      setItemQuantity(itemQuantity+selectedQuantity)
    }
  },[buyButton]
  )
  */
  return(
    <div>
        {itemQuantity && `Ya tienes ${itemQuantity} en el carrito`}  
    </div>
  )
}

QuantityOnCart.schema = {
  title: 'editor.quantity-on-cart.title',
  description: 'editor.quantity-on-cart.description',
  type: 'object',
  properties: {},
}

export default QuantityOnCart

