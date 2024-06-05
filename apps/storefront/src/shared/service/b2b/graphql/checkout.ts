import B3Request from '../../request/b3Fetch';

const checkoutLogin = `mutation checkoutLogin($cartData: CheckoutLoginType!) {
    checkoutLogin(
        cartData: $cartData
    ) {
        result {
            redirectUrl
        }
    }
}`;

// eslint-disable-next-line import/prefer-default-export
export const b2bCheckoutLogin = (data: CustomFieldItems) =>
  B3Request.graphqlB2B({
    query: checkoutLogin,
    variables: data,
  });
