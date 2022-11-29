import {
  useContext,
  Fragment,
} from 'react'

import {
  Box,
  Card,
  CardContent,
  Stack,
  Typography,
  Link,
} from '@mui/material'

import styled from '@emotion/styled'

import {
  format,
} from 'date-fns'

import {
  OrderProductItem,
  OrderShippedItem,
  OrderShippingsItem,
} from '../../../types'

import {
  OrderProduct,
} from './OrderProduct'

import {
  OrderDetailsContext,
} from '../context/OrderDetailsContext'

const ShipmentTitle = styled('span')(() => ({
  fontWeight: 'bold',
}))

export const OrderShipping = () => {
  const {
    state: {
      shippings = [],
      currency,
      addressLabelPermission,
    },
  } = useContext(OrderDetailsContext)

  const getFullName = (shipping: OrderShippingsItem) => {
    const {
      first_name: firstName,
      last_name: lastName,
    } = shipping

    return `${firstName} ${lastName}`
  }

  const getFullAddress = (shipping: OrderShippingsItem) => {
    const {
      street_1: street1,
      city,
      state,
      zip,
      country,
    } = shipping

    return `${street1}, ${city}, ${state} ${zip}, ${country}`
  }

  let shipmentIndex = 0
  const getShipmentIndex = () => {
    shipmentIndex += 1
    return shipmentIndex
  }

  const getShipmentText = (shipment: OrderShippedItem) => {
    const {
      date_created: createdDate,
      shipping_method: shippingMethod,
      shipping_provider: shippingProvider,
    } = shipment

    const time = format(new Date(createdDate), 'LLLL, d')

    return `shipped on ${time}, by ${shippingProvider}, ${shippingMethod}`
  }

  const getShippingProductQuantity = (item: OrderProductItem) => item.current_quantity_shipped || 0

  const getNotShippingProductQuantity = (item: OrderProductItem) => {
    const notShipNumber = item.quantity - item.quantity_shipped

    return notShipNumber > 0 ? notShipNumber : 0
  }

  const getCompanyName = (company: string) => {
    if (addressLabelPermission) {
      return company
    }

    const index = company.indexOf('/')

    return company.substring(index + 1, company.length)
  }

  return (
    <Stack spacing={2}>
      {
        shippings.map((shipping: OrderShippingsItem) => (
          <Card key={`shipping-${shipping.id}`}>
            <CardContent>
              <Box sx={{
                wordBreak: 'break-word',
              }}
              >
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1.125rem',
                  }}
                >
                  {getFullName(shipping)}
                  {' - '}
                  {getCompanyName(shipping.company || '')}
                </Typography>
                <Typography
                  variant="h6"
                  sx={{
                    fontSize: '1.125rem',
                  }}
                >
                  {getFullAddress(shipping)}
                </Typography>
              </Box>

              {
                (shipping.shipmentItems || []).map((shipment: OrderShippedItem) => (
                  shipment.itemsInfo.length > 0 ? (
                    <Fragment key={`shipment-${shipment.id}`}>
                      <Box sx={{
                        margin: '20px 0 2px',
                      }}
                      >
                        <Typography variant="body1">
                          <>
                            <ShipmentTitle>{`Shipment ${getShipmentIndex()} - `}</ShipmentTitle>
                            {getShipmentText(shipment)}
                          </>
                        </Typography>
                        {
                          shipment.tracking_link
                            ? (
                              <Link
                                href={shipment.tracking_link}
                                target="_blank"
                              >
                                {shipment.tracking_number}
                              </Link>
                            )
                            : (
                              <Typography variant="body1">
                                {shipment.tracking_number}
                              </Typography>
                            )
                        }
                      </Box>
                      <OrderProduct
                        getProductQuantity={getShippingProductQuantity}
                        products={shipment.itemsInfo}
                        currency={currency}
                      />
                    </Fragment>
                  ) : <></>
                ))
              }

              {
                shipping.notShip.itemsInfo.length > 0 ? (
                  <Fragment key={`shipment-notShip-${shipping.id}`}>
                    <Box
                      sx={{
                        margin: '20px 0 2px',
                      }}
                    >
                      <Typography variant="body1">
                        <ShipmentTitle>Not Shipped yet</ShipmentTitle>
                      </Typography>
                    </Box>

                    <OrderProduct
                      getProductQuantity={getNotShippingProductQuantity}
                      products={shipping.notShip.itemsInfo}
                      currency={currency}
                    />
                  </Fragment>
                ) : <></>
              }

            </CardContent>
          </Card>
        ))
      }
    </Stack>
  )
}