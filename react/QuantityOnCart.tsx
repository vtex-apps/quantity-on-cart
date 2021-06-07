import React, {useEffect, useState} from 'react'
import { useProduct } from 'vtex.product-context'

import { useQuery } from 'react-apollo'

import getOrderForm from './graphql/getOrderForm.gql'

interface QuantityOnCartProps {
}

const QuantityOnCart: StorefrontFunctionComponent<QuantityOnCartProps> = ({}) => {
  const productContextValue = useProduct()
  const productId = productContextValue?.product?.items[0]?.itemId

  const [itemQuantity, setItemQuantity]: any = useState(null)

  const {
    data: dataGetOrderForm,
    loading: loadingGetOrderForm,
    error: errorGetOrderForm,
  } = useQuery(getOrderForm)

  useEffect ( () => {
    if(loadingGetOrderForm){
      console.log("loadingGetOrderOrderForm",loadingGetOrderForm)
    }
    if(errorGetOrderForm){
      console.log("errorGetOrderOrderForm",errorGetOrderForm)
    }
    if(dataGetOrderForm){
      console.log("dataGetOrderForm",dataGetOrderForm)
      const itemsOrderForm = dataGetOrderForm.orderForm.items
      const itemFound = itemsOrderForm?.find((element: { id: any }) => element.id == productId);

      setItemQuantity(itemFound?.quantity)
    }
  },[loadingGetOrderForm,errorGetOrderForm,dataGetOrderForm]//variable que escucha
  )

  return(
    <div>
        {itemQuantity && `Ya tiene ${itemQuantity} en el carrito`}

        
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