/**
 * @author Styves Daudet (Styves@griot.cm)
 * @description: Stripe product management - create, update, delete, etc.
 * @init_date: 02/02/2023
 * @last_modify_date: 02/02/2023
 * @last_modified_by: Styves Daudet
 */

import Stripe from "stripe";

const stripe = new Stripe(import.meta.env.VITE_APP_STRIPE_KEY as string, {
  apiVersion:"2025-05-28.basil", // Replace with your actual Stripe API version
});

// Types
type StripeProductCreateParams = Stripe.ProductCreateParams;
type StripeProductUpdateParams = Stripe.ProductUpdateParams;
type StripeProductListParams = Stripe.ProductListParams;
type StripeProductSearchParams = Stripe.ProductSearchParams;
type StripePriceCreateParams = Stripe.PriceCreateParams;
type StripeCouponCreateParams = Stripe.CouponCreateParams;
type StripePromotionCodeCreateParams = Stripe.PromotionCodeCreateParams;
type StripePromotionCodeUpdateParams = Stripe.PromotionCodeUpdateParams;
type StripeCheckoutSessionCreateParams = Stripe.Checkout.SessionCreateParams;
type StripeCheckoutSessionRetrieveParams = string;
type StripeCheckoutSessionListLineItemsParams = Stripe.Checkout.SessionListLineItemsParams;

// Product Creation
export const createNewProduct = (
  product: StripeProductCreateParams
): Promise<Stripe.Product> => {
  return stripe.products.create(product);
};

// Product Update
export const updateProduct = (
  id: string,
  product: StripeProductUpdateParams,
  options: Stripe.RequestOptions = {}
): Promise<Stripe.Product> => {
  return stripe.products.update(id, product, options);
};

// Get All Products
export const getAllProduct = (
  params: StripeProductListParams,
  options: Stripe.RequestOptions = {}
): Promise<Stripe.ApiList<Stripe.Product>> => {
  return stripe.products.list(params, options);
};

// Search Products
export const search = (
  params: StripeProductSearchParams,
  options: Stripe.RequestOptions = {}
): Promise<Stripe.ApiSearchResult<Stripe.Product>> => {
  return stripe.products.search(params, options);
};

// Create Price
export const createPrice = (
  productId: string,
  currency: string,
  price: number,
  recurring?: boolean
): Promise<Stripe.Price> => {
  const priceParams: StripePriceCreateParams = {
    unit_amount: price,
    currency,
    product: productId,
    ...(recurring && { recurring: { interval: "month" } }),
  };

  return stripe.prices.create(priceParams);
};

// Create Coupon
export const createCoupon = (
  params: StripeCouponCreateParams
): Promise<Stripe.Coupon> => {
  return stripe.coupons.create(params);
};

// Create Promotion Code
export const createPromotionCode = (
  params: StripePromotionCodeCreateParams
): Promise<Stripe.PromotionCode> => {
  return stripe.promotionCodes.create(params);
};

// List Coupons (logs results)
export const getListOfCoupon = (): void => {
  stripe.coupons.list().then((data:any) => {
    console.log("Record list of coupons:", data);
  });
};

// Checkout Session Retrieval
export const retrieveCheckout = (
  sessionId: StripeCheckoutSessionRetrieveParams
): Promise<Stripe.Checkout.Session> => {
  return stripe.checkout.sessions.retrieve(sessionId);
};
/*
// List Line Items
export const listLineItems = (
  params: StripeCheckoutSessionListLineItemsParams
): Promise<Stripe.ApiList<Stripe.LineItem>> => {
  return stripe.checkout.sessions.listLineItems(params.session);
};
*/
// Create Checkout Session
export const createCheckout = (
  params: StripeCheckoutSessionCreateParams
): Promise<Stripe.Checkout.Session> => {
  return stripe.checkout.sessions.create(params);
};

// Create Promotion
export const createNewPromotions = (
  params: StripePromotionCodeCreateParams
): Promise<Stripe.PromotionCode> => {
  return stripe.promotionCodes.create(params);
};

// Update Promotion
export const updatePromotions = (
  id: string,
  params: StripePromotionCodeUpdateParams
): Promise<Stripe.PromotionCode> => {
  return stripe.promotionCodes.update(id, params);
};

// Get Card Type (Not Implemented Properly)
export const getCardType = (): void => {
  // This needs implementation details (e.g. create payment intent with a payment method)
  console.warn("getCardType() is not implemented.");
};

// Default export (if needed)
export default {
  createNewProduct,
  updateProduct,
  getAllProduct,
  search,
};
