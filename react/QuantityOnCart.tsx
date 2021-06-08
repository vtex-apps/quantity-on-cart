import React, {useEffect, useState} from 'react'
import {useProduct} from 'vtex.product-context'

import {useQuery} from 'react-apollo'
//import {useQuery, useLazyQuery } from 'react-apollo'

import getOrderForm from './graphql/getOrderForm.gql'

import {canUseDOM} from 'vtex.render-runtime'

import {PixelMessage,} from './typings/events'


interface QuantityOnCartProps {
}

const QuantityOnCart: StorefrontFunctionComponent<QuantityOnCartProps> = ({}) => {
    const productContextValue = useProduct()
    const productId = productContextValue?.product?.items[0]?.itemId
    const [itemQuantity, setItemQuantity]: any = useState(null)
    const [buyButton, setBuyButton]: any = useState(null)
    const [itemsCartUpdate, setItemsCartUpdate]: any = useState(null)

    const [itemsCartRemove, setItemsCartRemove]: any = useState(null)

    const {data: dataGetOrderForm} = useQuery(getOrderForm)

    function handleEvents(e: PixelMessage) {
        switch (e.data.eventName) {
            case 'vtex:addToCart': {
                if (e.data.id && e.data.id === "add-to-cart-button") {
                    setBuyButton(e.data)
                } else {
                    setItemsCartUpdate(e.data)
                }
                return
            }
            case 'vtex:removeFromCart': {
                setItemsCartRemove(e.data)
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

    useEffect(() => {
            console.log('me llamo on state change');
            if (dataGetOrderForm) {
                const itemsOrderForm = dataGetOrderForm.orderForm.items
                const itemFound = itemsOrderForm?.find((element: { id: any }) => element.id == productId);
                setItemQuantity(itemFound?.quantity)
            }
        }, [dataGetOrderForm]
    )

    useEffect(() => {
            if (itemsCartUpdate) {
                const itemsOrderForm = itemsCartUpdate.items
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId == productId);
                if (itemFound?.quantity) {
                    setItemQuantity(itemFound?.quantity)
                } else {
                    setItemQuantity(itemQuantity)
                }
            } else {
                setItemQuantity(itemQuantity)
            }
        }, [itemsCartUpdate]
    )

    useEffect(() => {
            if (buyButton && itemQuantity) {
                const itemsOrderForm = buyButton.items
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId == productId);
                if (itemFound?.quantity) {
                    setItemQuantity(itemQuantity + itemFound?.quantity)
                } else {
                    setItemQuantity(itemQuantity)
                }
            } else if (buyButton && !itemQuantity) {
                const itemsOrderForm = buyButton.items
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId == productId);
                if (itemFound?.quantity) {
                    setItemQuantity(0 + itemFound?.quantity)
                }
            } else {
                setItemQuantity(itemQuantity)
            }
            /*
            }else if (!buyButton && itemQuantity){
              console.log("aca",productId)
              setItemQuantity(itemQuantity)
            }else{
              setItemQuantity(0)
              console.log("aca2",productId)
            }
            */

            setBuyButton(false)
        }, [buyButton]
    )

    useEffect(() => {
            if (itemsCartRemove) {
                const itemsOrderForm = itemsCartRemove.items
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId == productId);
                if (itemFound?.quantity) {
                    setItemQuantity(0)
                }
            }
        }, [itemsCartRemove]
    )

    let mensaje = (itemQuantity && itemQuantity > 0) ? `Tienes ${itemQuantity} en el carrito` : ''
    return (
        <div>
            <p>
                { mensaje }
            </p>
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

