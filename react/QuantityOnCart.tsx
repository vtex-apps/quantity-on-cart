/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'
import { useQuery } from 'react-apollo'
import { canUseDOM, useRuntime } from 'vtex.render-runtime'
import { useCssHandles } from 'vtex.css-handles'
import {
    useIntl,
    defineMessages} from 'react-intl';
import type { MessageDescriptor
  } from 'react-intl';


import getOrderForm from './graphql/getOrderForm.gql'
import type { PixelMessage } from './typings/events'
import type { Item } from './typings/global'

const QuantityOnCart: StorefrontFunctionComponent = () => {
  const productContextValue = useProduct()

  if (!productContextValue?.product?.items) {
    return null
  }

  const runtime = useRuntime()
  const [pageState] = useState(runtime)

  const productId = productContextValue?.product?.items[0].itemId

  const [itemQuantity, setItemQuantity] = useState<number>(0)

  const [itemsCartRemove, setItemsCartRemove] = useState<any>(null)

  const [itemsCartChange, setItemsCartChange] = useState<any>(null)

  const [itemsCartChangeBuyBotton, setItemsCartChangeBuyBotton] = useState<any>(
    null
  )

  const [mensaje, setMensaje] = useState<typeof itemQuantity>(itemQuantity)

  const [key, setKey] = useState<string>('')

  const { data: dataGetOrderForm, refetch } = useQuery(getOrderForm, {
    ssr: false,
  })

  const intl = useIntl()

  const messagesInternationalization = defineMessages({
    have: { id: 'store/quantity-on-cart.have' },
    units: { id: 'store/quantity-on-cart.units' },
  })
  
  const translateMessage = (message: MessageDescriptor) =>
    intl.formatMessage(message)

  if (productContextValue?.product?.items.length > 1) {
    return null
  }

  useEffect(() => {
    if (dataGetOrderForm && productContextValue) {
      refetch()
    }
  }, [pageState])

  useEffect(() => {
    if (dataGetOrderForm && productContextValue) {
      const itemsOrderForm = dataGetOrderForm.orderForm.items
      const itemFound: Item  = itemsOrderForm?.find(
        (element: { id: any }) => element.id === productId
      )

      setItemQuantity(itemFound?.quantity)
    }else{
        null
    }
  }, [dataGetOrderForm])

  useEffect(() => {
    if (productContextValue) {
      if (canUseDOM) {
        window.removeEventListener('message', handleEvents)
        window.addEventListener('message', handleEvents)
      }
    }
  }, [productContextValue])

  async function handleEvents(e: PixelMessage) {
    switch (e.data.eventName) {
        
      case 'vtex:removeFromCart': {
        setItemsCartRemove(e.data)
        break
      }

      case 'vtex:cartChanged': {
        if (dataGetOrderForm && productContextValue) {
          setItemsCartChange(e.data)
        }

        break
      }

      case 'vtex:addToCart': {
        if (e.data.id && e.data.id === 'add-to-cart-button') {
          if (dataGetOrderForm && productContextValue) {
            setItemsCartChangeBuyBotton(e.data)
          }
        }

        break
      }

      default: {
        break
      }
    }
  }

  useEffect(() => {
    if(!itemsCartChange) return

    const { items }  = itemsCartChange
    const itemFound = items?.find(({ skuId }: any) => skuId === productId)

    if (itemFound?.quantity) {
        setItemQuantity(itemFound?.quantity)
    }
    
  }, [itemsCartChange])

  useEffect(() => {
    
    if(!itemsCartChangeBuyBotton) return

    const { items } = itemsCartChangeBuyBotton
    const itemFound: Item = items?.find(({ skuId }: any) => skuId === productId)

    if (itemFound?.quantity) {
      if (itemQuantity === undefined) {
        setItemQuantity(0 + itemFound?.quantity)
      } else {
        setItemQuantity(itemQuantity + itemFound?.quantity)
      }
    } else {
      setItemQuantity(itemQuantity)
    }

  }, [itemsCartChangeBuyBotton])

  useEffect(() => {
    
    if(!itemsCartRemove) return

    const {items} = itemsCartRemove
    const itemFound: Item = items?.find(({ skuId }: any) => skuId === productId)

    if (itemFound?.quantity) {
      setItemQuantity(0)
    }
    
  }, [itemsCartRemove])

  useEffect(() => {
    if (itemQuantity || itemQuantity === 0) {
      setMensaje(
        itemQuantity * productContextValue?.product?.items[0]?.unitMultiplier
      )
      setKey(`quantity-on-cart-${  productId.toString()}`)
    }else{
        null
    }
  }, [itemQuantity])

  const CSS_HANDLES = ['quantityOnCart']
  const handles = useCssHandles(CSS_HANDLES)

  if (!mensaje) return null
  
  

  return (
    <div key={key} id={key} className={`${handles.quantityOnCart} t-body mh1 mv2`}>
      {mensaje > 0 ? `${translateMessage(messagesInternationalization.have)} ${mensaje} ${translateMessage(messagesInternationalization.units)}` : null}
    </div>
  )
}

export default QuantityOnCart
