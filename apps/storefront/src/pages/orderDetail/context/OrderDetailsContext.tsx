import {
  useReducer,
  createContext,
  Dispatch,
  ReactNode,
  useMemo,
} from 'react'

import {
  OrderStatusItem,
  OrderShippingsItem,
  OrderHistoryItem,
  OrderProductItem,
  OrderCurrency,
  OrderSummary,
  OrderPayment,
} from '../../../types'

export interface OrderDetailsState {
  shippings?: OrderShippingsItem[],
  history?: OrderHistoryItem[],
  poNumber?: string,
  status?: string,
  statusCode?: string | number,
  currencyCode?: string,
  currency?: string,
  orderSummary?: OrderSummary,
  customStatus?: string,
  money?: OrderCurrency,
  payment?: OrderPayment,
  orderComments?: string,
  products?: OrderProductItem[],
  orderId?: number | string,
  orderStatus?: OrderStatusItem[],
  ipStatus?: number,
  invoiceId?: number,
  addressLabelPermission?: boolean,
  canReturn?: boolean,
}
interface OrderDetailsAction {
  type: string,
  payload: OrderDetailsState
}
export interface OrderDetailsContextType {
  state: OrderDetailsState,
  dispatch: Dispatch<OrderDetailsAction>,
}

interface OrderDetailsProviderProps {
  children: ReactNode
}

const initState = {
  shippings: [],
  history: [],
  poNumber: '',
  status: '',
  statusCode: '',
  currencyCode: '',
  currency: '',
  orderSummary: {
    createAt: '',
    name: '',
    priceData: {},
  },
  customStatus: '',
  money: {},
  payment: {},
  orderComments: '',
  products: [],
  orderId: '',
  orderStatus: [],
  ipStatus: 0,
  invoiceId: 0,
  addressLabelPermission: false,
  canReturn: false,
}

export const OrderDetailsContext = createContext<OrderDetailsContextType>({
  state: initState,
  dispatch: () => {},
})

const reducer = (state: OrderDetailsState, action: OrderDetailsAction) => {
  switch (action.type) {
    case 'all':
      return {
        ...state,
        ...action.payload,
      }
    case 'statusType':
      return {
        ...state,
        orderStatus: action.payload.orderStatus,
      }
    case 'addressLabel':
      return {
        ...state,
        addressLabelPermission: action.payload.addressLabelPermission,
      }
    default:
      return state
  }
}

export function OrderDetailsProvider(props: OrderDetailsProviderProps) {
  const [state, dispatch] = useReducer(reducer, initState)

  const {
    children,
  } = props

  const OrderDetailsValue = useMemo(() => ({
    state,
    dispatch,
  }), [state])

  return (
    <OrderDetailsContext.Provider value={OrderDetailsValue}>
      {children}
    </OrderDetailsContext.Provider>
  )
}
