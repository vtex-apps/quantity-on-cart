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

    const [itemsCartRemove, setItemsCartRemove]: any = useState(null)

    const [itemsCartChange, setItemsCartChange]: any = useState(null)

    const [mensaje, setMensaje]: any = useState(itemQuantity)

    const {data: dataGetOrderForm, refetch, called} = useQuery(getOrderForm)
    //const {data: dataGetOrderForm, refetch, called} = useQuery(getOrderForm)

    //getOrderFormQuery()
    useEffect(() => {
        if (dataGetOrderForm && productContextValue) {
            const itemsOrderForm = dataGetOrderForm.orderForm.items
            const itemFound = itemsOrderForm?.find((element: { id: any }) => element.id === productId);
            setItemQuantity(itemFound?.quantity)
        }
    }, [dataGetOrderForm]
    )

    useEffect(() => {
        if (productContextValue){
            if (canUseDOM) {
                window.addEventListener('message', handleEvents)
            }
        }
    }, [productContextValue]
    )

    function handleEvents(e: PixelMessage) {
        switch (e.data.eventName) {
            case 'vtex:removeFromCart': {
                setItemsCartRemove(e.data)
                return
            }
            case 'vtex:pageView': {             
                if (dataGetOrderForm && productId && called){
                    //console.log("pageView",e)
                    //problemas en este caso
                    refetch()
                    //setItemsCartChange(e.data)
                }
                return
            }
            
            case 'vtex:cartChanged': {
                if (dataGetOrderForm && productContextValue/* && called*/){
                    //console.log("cartChanged")
                    setItemsCartChange(e.data)
                }
                return
            }
            
            case 'vtex:productView': {             
                //if (dataGetOrderForm && productId/* && called*/){
                    //console.log("productView",e)
                    //problemas en este caso
                    //setItemsCartChange(e.data)
                //}
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

