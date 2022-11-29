import {
  useState,
  useContext,
  Fragment,
} from 'react'
import {
  useNavigate,
} from 'react-router-dom'

import {
  Card,
  CardContent,
  Typography,
  Button,
} from '@mui/material'
import styled from '@emotion/styled'

import {
  format,
} from 'date-fns'

import {
  GlobaledContext,
} from '@/shared/global'

import {
  OrderDialog,
} from './OrderDialog'

import {
  OrderCurrency,
  OrderProductItem,
  Address,
} from '../../../types'

import {
  OrderDetailsState,
} from '../context/OrderDetailsContext'

const OrderActionContainer = styled('div')(() => ({}))

/// orderCard
const InformationContainer = styled('div')(() => ({
  background: '#F5F5F5',
  padding: '1rem',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
  marginTop: '0.5rem',
}))

const OrderCardHeader = styled(Typography)(() => ({
  padding: '1rem 0 0 1rem',
}))

const StyledCardActions = styled('div')(() => ({
  flexWrap: 'wrap',
  padding: '0 1rem 1rem 1rem',

  '& button': {
    marginLeft: '0',
    marginRight: '8px',
    margin: '8px 8px 0 0',
  },
}))

interface ItemContainerProps {
  nameKey: string
}

const ItemContainer = styled('div')((props: ItemContainerProps) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: props.nameKey === 'Grand total' ? 700 : 400,

  '& p': {
    marginTop: 0,
  },
}))

interface PaymentItemContainerProps {
  isAddMarginButton: boolean
}

const PaymentItemContainer = styled('div')((props: PaymentItemContainerProps) => ({
  display: 'flex',
  justifyContent: 'space-between',
  fontWeight: 400,
  marginBottom: props.isAddMarginButton ? '0.8rem' : '',
}))

const StyledCurrency = styled('div')(() => ({
  display: 'flex',
  alignItems: 'center',
  width: '40%',
  justifyContent: 'space-between',
}))

interface Infos {
  info: {
    [k: string]: string
  },
  money?: OrderCurrency
}

interface Buttons {
  value: string,
  key: string,
  name: string,
  variant?: 'text' | 'contained' | 'outlined',
  isCanShow: boolean,
}

interface OrderCardProps {
  header: string,
  subtitle: string,
  buttons: Buttons[],
  infos: Infos | string,
  products: OrderProductItem[],
  itemKey: string,
  orderId: string,
  currencyInfo: OrderCurrency,
}

interface DialogData{
  dialogTitle: string,
  type: string,
  description: string,
  confirmText: string,
}

const OrderCard = (props: OrderCardProps) => {
  const {
    header,
    subtitle,
    buttons,
    infos,
    products,
    itemKey,
    orderId,
    currencyInfo,
  } = props

  const navigate = useNavigate()

  const dialogData = [
    {
      dialogTitle: 'Re-order',
      type: 'reOrder',
      description: 'Select products and quantity for reorder',
      confirmText: 'Add to cart',
    },
    {
      dialogTitle: 'Return',
      type: 'return',
      description: 'Select products and quantity for return',
      confirmText: 'Submit return request',
    },
    {
      dialogTitle: 'Add to shipping list',
      type: 'shippingList',
      description: 'Select products and quantity to add to shopping list',
      confirmText: 'Add to shopping list',
    },
  ]

  const [open, setOpen] = useState<boolean>(false)
  const [type, setType] = useState<string>('')
  const [currentDialogData, setCurrentDialogData] = useState<DialogData>()

  let infoKey: string[] = []
  let infoValue: string[] = []
  if (typeof infos !== 'string') {
    const {
      info,
    } = infos

    infoKey = Object.keys(info)
    infoValue = Object.values(info)
  }

  const handleOpenDialog = (name: string) => {
    if (name === 'viewInvoice') {
      navigate('/invoiceDetail/1')
    } else if (name === 'printInvoice') {
      window.open(`/account.php?action=print_invoice&order_id=${orderId}`)
    } else if (name === 'return') {
      // TODO
    } else {
      setOpen(true)
      setType(name)

      const newDialogData = dialogData.find((data: DialogData) => data.type === name)
      setCurrentDialogData(newDialogData)
    }
  }

  return (
    <Card
      sx={{
        marginBottom: '1rem',
      }}
    >
      <OrderCardHeader variant="h5">
        {header}
      </OrderCardHeader>
      <CardContent>
        {
          subtitle && <div>{subtitle}</div>
        }
        <InformationContainer>
          {
            typeof infos === 'string' ? (
              infos
            ) : (
              <>
                {
                  infos.money ? (
                    infoKey && infoKey.map((key: string, index: number) => (
                      <ItemContainer
                        key={key}
                        nameKey={key}
                      >
                        <p>{key}</p>
                        <StyledCurrency>
                          <p>{infos.money?.currency_token}</p>
                          <p>{infoValue[index]}</p>
                        </StyledCurrency>
                      </ItemContainer>
                    ))
                  ) : (
                    infoValue && infoValue.map((value: string, index: number) => (
                      <PaymentItemContainer
                        key={value}
                        isAddMarginButton={(infoKey[index] === 'paymentMethod' || infoKey[index] === 'company')}
                      >
                        {value}
                      </PaymentItemContainer>
                    ))
                  )
                }
              </>
            )
          }
        </InformationContainer>
      </CardContent>
      <StyledCardActions>
        {
          buttons && buttons.map((button: Buttons) => (
            <Fragment key={button.key}>
              {
                button.isCanShow && (
                  <Button
                    value={button.value}
                    key={button.key}
                    name={button.name}
                    variant={button.variant}
                    onClick={() => { handleOpenDialog(button.name) }}
                  >
                    {button.value}
                  </Button>
                )
              }
            </Fragment>
          ))
        }
      </StyledCardActions>

      <OrderDialog
        open={open}
        products={products}
        currentDialogData={currentDialogData}
        type={type}
        setOpen={setOpen}
        itemKey={itemKey}
        currencyInfo={currencyInfo}
      />
    </Card>
  )
}

interface OrderActionProps {
  detailsData: OrderDetailsState,
}

interface OrderData {
  header: string,
  key: string,
  subtitle: string,
  buttons: Buttons[],
  infos: Infos | string,
}

export const OrderAction = (props: OrderActionProps) => {
  const {
    detailsData,
  } = props
  const {
    state: {
      isB2BUser,
    },
  } = useContext(GlobaledContext)

  const {
    money,
    orderSummary: {
      createAt,
      name,
      priceData,
    } = {},
    payment: {
      updatedAt,
      billingAddress,
      paymentMethod,
    } = {},
    orderComments = '',
    products,
    orderId,
    ipStatus = 0,
  } = detailsData

  if (!orderId) {
    return <></>
  }

  const getFullPaymentAddress = (billingAddress?: Address) => {
    if (!billingAddress) {
      return {}
    }
    const {
      first_name: firstName,
      last_name: lastName,
      company,
      street_1: street1,
      state,
      zip,
      country,
      city,
    } = billingAddress || {}
    const paymentAddress = {
      paymentMethod: `Payment by ${paymentMethod}`,
      name: `${firstName} ${lastName}`,
      company,
      street: street1,
      address: `${city}, ${state} ${zip}, ${country}`,
    }

    return paymentAddress
  }

  const handleOrderComments = (value: string) => {
    const commentsArr = value.split(/\n/g)

    const comments: {
      [k: string]: string
    } = {}

    commentsArr.forEach((item, index) => {
      if (item.trim().length > 0) {
        const isHaveTitle = item.trim().includes(':')

        const message = isHaveTitle ? item : `Comments: ${item}`

        comments[`mes${index}`] = message
      }
    })

    return comments
  }

  const buttons: Buttons[] = [
    {
      value: 'Re-Order',
      key: 'Re-Order',
      name: 'reOrder',
      variant: 'outlined',
      isCanShow: true,
    },
    {
      value: 'Return',
      key: 'Return',
      name: 'return',
      variant: 'outlined',
      isCanShow: true,
    },
    {
      value: 'ADD TO SHOPPING LIST',
      key: 'add-to-shipping-list',
      name: 'shippingList',
      variant: 'outlined',
      isCanShow: isB2BUser,
    },
  ]

  const orderData: OrderData[] = [
    {
      header: 'Order summary',
      key: 'order-summary',
      subtitle: (updatedAt && name ? `Purchased by ${name} on ${format(+updatedAt * 1000, 'dd MMM yy')}.` : ''),
      buttons,
      infos: {
        money,
        info: priceData || {},
      },
    },
    {
      header: 'Payment',
      key: 'payment',
      subtitle: (createAt ? `Paid in full on ${format(Date.parse(createAt), 'dd MMM yy')}.` : ''),
      buttons: [
        {
          value: isB2BUser ? 'view invoice' : 'print invoice',
          key: 'aboutInvoice',
          name: isB2BUser ? 'viewInvoice' : 'printInvoice',
          variant: 'outlined',
          isCanShow: !isB2BUser || +ipStatus !== 0,
        },
      ],
      infos: {
        info: getFullPaymentAddress(billingAddress),
      },
    },
    {
      header: 'Order comments',
      key: 'order-comments',
      subtitle: '',
      buttons: [],
      infos: {
        info: handleOrderComments(orderComments),
      },
    },
  ]

  return (
    <OrderActionContainer>
      {
        orderData && orderData.map((item: OrderData) => (
          <OrderCard
            products={products!}
            orderId={orderId.toString()}
            currencyInfo={money!}
            {...item}
            itemKey={item.key}
          />
        ))
      }
    </OrderActionContainer>
  )
}