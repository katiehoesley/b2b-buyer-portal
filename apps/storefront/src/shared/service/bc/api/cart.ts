import { baseUrl } from '../../../../utils/basicConfig';
import B3Request from '../../request/b3Fetch';
import { RequestType } from '../../request/base';

export const createCartHeadless = (data: CustomFieldItems) =>
  B3Request.post(`${baseUrl}/api/storefront/carts`, RequestType.BCRest, data);

export const getCartInfo = () =>
  B3Request.get(`${baseUrl}/api/storefront/carts`, RequestType.BCRest);

export const createCart = (data: CustomFieldItems) =>
  B3Request.post(`${baseUrl}/api/storefront/carts`, RequestType.BCGraphql, data);

export const addProductToCart = (data: CustomFieldItems, cartId: string) =>
  B3Request.post(`${baseUrl}/api/storefront/carts/${cartId}/items`, RequestType.BCRest, data);

export const getCartInfoWithOptions = () =>
  B3Request.get(
    `${baseUrl}/api/storefront/carts?include=lineItems.digitalItems.options,lineItems.physicalItems.options`,
    RequestType.BCRest,
  );

export const deleteCart = (cartId: string) =>
  B3Request.delete(`${baseUrl}/api/storefront/carts/${cartId}`, RequestType.BCRest);
