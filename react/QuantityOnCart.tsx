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

  const [buyButton, setBuyButton]: any = useState(null)

  const [itemsCartUpdate, setItemsCartUpdate]: any = useState(null)

  const { loading: loadingGetOrderForm, error: errorGetOrderForm, data: dataGetOrderForm } = useQuery(getOrderForm)
  
  function handleEvents(e: PixelMessage) {
    switch (e.data.eventName) {
      case 'vtex:addToCart': {
        if(e.data.id && e.data.id == "add-to-cart-button"){
          setBuyButton(e.data)
        }else{
          setItemsCartUpdate(e.data)        
        }
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
    /*if(loadingGetOrderForm){
      console.log("loadingGetOrderOrderForm",loadingGetOrderForm)
    }
    if(errorGetOrderForm){
      console.log("errorGetOrderOrderForm",errorGetOrderForm)
    }*/
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
      if(itemFound?.quantity){
        setItemQuantity(itemFound?.quantity)
      }else{
        setItemQuantity(itemQuantity)
      }
      //setItemsCartUpdate(null)        
    }else{
      setItemQuantity(itemQuantity)
    }
  },[itemsCartUpdate]
  )

  useEffect ( () => {
    if(buyButton && itemQuantity){
      console.log("entre",itemQuantity)
      const itemsOrderForm = buyButton.items
      const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId == productId);
      if(itemFound?.quantity){
        setItemQuantity(itemQuantity+itemFound?.quantity)
      }else{
        setItemQuantity(itemQuantity)
      }
    }else if(buyButton && !itemQuantity) {
      const itemsOrderForm = buyButton.items
      const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId == productId);
      if(itemFound?.quantity){
        setItemQuantity(0+itemFound?.quantity)
      }
    }else{
      setItemQuantity(itemQuantity)
    }
    setBuyButton(false)
  },[buyButton]
  )
  
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

