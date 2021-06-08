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

    const [mensaje, setMensaje]: any = useState(itemQuantity)

    const [pageView, setPageView]: any = useState(null)
    //const [cartChange, setCartChange]: any = useState(null)

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
            case 'vtex:pageView': {
                setPageView(e)
                return}
            /*case 'vtex:cartChanged': {
                setCartChange(e)
            }*/
            default: {
                break
            }
        }
    }

    if (canUseDOM) {
        window.addEventListener('message', handleEvents)
    }

    useEffect(() => {
            if (dataGetOrderForm) {
                const itemsOrderForm = dataGetOrderForm.orderForm.items
                const itemFound = itemsOrderForm?.find((element: { id: any }) => element.id === productId);
                setItemQuantity(itemFound?.quantity)
            }
        }, [dataGetOrderForm,productId,pageView]
    )

    useEffect(() => {
            if (itemsCartUpdate) {
                const itemsOrderForm = itemsCartUpdate.items
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId === productId);
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
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId === productId);
                if (itemFound?.quantity) {
                    setItemQuantity(itemQuantity + itemFound?.quantity)
                } else {
                    setItemQuantity(itemQuantity)
                }
            } else if (buyButton && !itemQuantity) {
                const itemsOrderForm = buyButton.items
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId === productId);
                if (itemFound?.quantity) {
                    setItemQuantity(0 + itemFound?.quantity)
                }
            } else {
                setItemQuantity(itemQuantity)
            }
            setBuyButton(null)
        }, [buyButton]
    )

    useEffect(() => {
            if (itemsCartRemove) {
                const itemsOrderForm = itemsCartRemove.items
                const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId === productId);
                if (itemFound?.quantity) {
                    setItemQuantity(0)
                }
            }
        }, [itemsCartRemove]
    )

    useEffect(() => {
            if (itemQuantity || itemQuantity === 0) {
                setMensaje(itemQuantity)
            }
    }, [itemQuantity]
    )

    return (
        <div>
            <p>
                { mensaje>0 ? `Tienes ${mensaje} en el carrito` : '' }
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

