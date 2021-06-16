import React, { useEffect, useState } from 'react'
import { useProduct } from 'vtex.product-context'

import { useQuery } from 'react-apollo'

import getOrderForm from './graphql/getOrderForm.gql'

import { canUseDOM, useRuntime } from 'vtex.render-runtime'

import { PixelMessage, } from './typings/events'

import { useCssHandles } from 'vtex.css-handles'

interface QuantityOnCartProps {
}

const QuantityOnCart: StorefrontFunctionComponent<QuantityOnCartProps> = ({}) => {
    const productContextValue = useProduct()

    if (!productContextValue?.product?.items) {
        return null
    }

    const runtime = useRuntime()
    const [pageState] = useState(runtime)

    const productId = productContextValue?.product?.items[0].itemId

    const [itemQuantity, setItemQuantity]: any = useState(null)

    const [itemsCartRemove, setItemsCartRemove]: any = useState(null)

    const [itemsCartChange, setItemsCartChange]: any = useState(null)

    const [itemsCartChangeBuyBotton, setItemsCartChangeBuyBotton]: any = useState(null)

    const [mensaje, setMensaje]: any = useState(itemQuantity)

    const { data: dataGetOrderForm, refetch } = useQuery(getOrderForm, { ssr: false })


    useEffect(() => {
        if (dataGetOrderForm && productContextValue) {
            refetch()
        }
    }, [pageState]
    )

    useEffect(() => {
        if (dataGetOrderForm && productContextValue) {
            const itemsOrderForm = dataGetOrderForm.orderForm.items
            const itemFound = itemsOrderForm?.find((element: { id: any }) => element.id === productId);
            setItemQuantity(itemFound?.quantity)
        }
    }, [dataGetOrderForm]
    )


    useEffect(() => {
        if (productContextValue) {
            if (canUseDOM) {
                window.removeEventListener('message', handleEvents)
                window.addEventListener('message', handleEvents)
            }
        }
    }, [productContextValue]
    )

    async function handleEvents(e: PixelMessage) {
        switch (e.data.eventName) {
            case 'vtex:removeFromCart': {
                setItemsCartRemove(e.data)
                return
            }
            case 'vtex:cartChanged': {
                if (dataGetOrderForm && productContextValue) {
                    setItemsCartChange(e.data)
                }
                return
            }
            case 'vtex:addToCart': {
                if (e.data.id && e.data.id === "add-to-cart-button") {
                    if (dataGetOrderForm && productContextValue) {
                        setItemsCartChangeBuyBotton(e.data)
                    }
                }
                return
            }
            default: {
                break
            }
        }
    }

    useEffect(() => {
        if (itemsCartChange) {
            const itemsOrderForm = itemsCartChange.items
            const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId === productId);
            if (itemFound?.quantity) {
                setItemQuantity(itemFound?.quantity)
            }
        }
    }, [itemsCartChange]
    )

    useEffect(() => {
        if (itemsCartChangeBuyBotton) {
            const itemsOrderForm = itemsCartChangeBuyBotton.items
            const itemFound = itemsOrderForm?.find((element: { productId: any }) => element.productId === productId);
            if (itemFound?.quantity) {
                if (itemQuantity === undefined) {
                    setItemQuantity(0 + itemFound?.quantity)
                } else {
                    setItemQuantity(itemQuantity + itemFound?.quantity)
                }
            } else {
                setItemQuantity(itemQuantity)
            }
        }
    }, [itemsCartChangeBuyBotton]
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
            setMensaje(itemQuantity * productContextValue?.product?.items[0]?.unitMultiplier)
        
        }
    }, [itemQuantity]
    )


    const CSS_HANDLES = ["quantityOnCart"]
    const handles = useCssHandles(CSS_HANDLES)

    return (
        <div className={`${handles.quantityOnCart} t-body mh1 mv2`}>
            {mensaje > 0 ? `Tienes ${mensaje} unidades en el carrito` : ''}
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
