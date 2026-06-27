import { useState, useEffect, useRef } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  useCart,
  useAddresses,
  useCheckout,
  useValidateDiscount,
} from '../../hooks/useBuyer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatPrice, DELIVERY_FEES } from '../../types';
import type { DeliveryMethod } from '../../types';

type DiscountType = 'voucher' | 'promo' | null;

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { data: cart, isLoading: cartLoading, isError: cartError } = useCart();
  const { data: addresses, isLoading: addrLoading, isError: addrError } = useAddresses();
  const checkoutMutation = useCheckout();

  const [selectedAddressId, setSelectedAddressId] = useState<number | null>(null);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>('REGULAR');
  const [discountType, setDiscountType] = useState<DiscountType>(null);
  const [voucherCode, setVoucherCode] = useState('');
  const [promoCode, setPromoCode] = useState('');
  const [debouncedDiscount, setDebouncedDiscount] = useState('');

  const [checkoutError, setCheckoutError] = useState('');

  const debounceTimer = useRef<ReturnType<typeof setTimeout>>();

  const subtotal = cart?.items.reduce((sum, item) => {
    const price = Number(item.product.price) || 0;
    return sum + price * item.quantity;
  }, 0) || 0;

  const { data: discountResult, isFetching: discountLoading, isError: discountIsError, error: discountApiError } = useValidateDiscount(
    debouncedDiscount,
    subtotal
  );
  const discountError = discountIsError && debouncedDiscount
    ? (discountApiError as { message?: string })?.message || 'Invalid discount code.'
    : '';

  const handleDiscountCodeChange = (value: string, type: DiscountType) => {
    if (type === 'voucher') {
      setDiscountType('voucher');
      setVoucherCode(value);
      setPromoCode('');
    } else if (type === 'promo') {
      setDiscountType('promo');
      setPromoCode(value);
      setVoucherCode('');
    }

    if (debounceTimer.current) clearTimeout(debounceTimer.current);

    if (!value.trim()) {
      setDebouncedDiscount('');
      return;
    }

    debounceTimer.current = setTimeout(() => {
      setDebouncedDiscount(value.trim());
    }, 300);
  };

  useEffect(() => {
    if (!addrLoading && addresses && addresses.length > 0) {
      const defaultAddr = addresses.find(a => a.isDefault);
      if (defaultAddr) setSelectedAddressId(defaultAddr.id);
      else setSelectedAddressId(addresses[0].id);
    }
  }, [addrLoading, addresses]);

  const deliveryFee = DELIVERY_FEES[deliveryMethod];
  const discountAmount = discountResult ? Number(discountResult.discountAmount) || 0 : 0;
  const taxBase = subtotal - discountAmount;
  const ppnAmount = Math.round(taxBase * 0.12);
  const finalTotal = taxBase + deliveryFee + ppnAmount;

  const handleSubmit = async () => {
    if (!selectedAddressId) return;
    if (cartError || !cart || cart.items.length === 0) return;

    setCheckoutError('');

    const payload: {
      addressId: number;
      deliveryMethod: DeliveryMethod;
      voucherCode?: string;
      promoCode?: string;
    } = {
      addressId: selectedAddressId,
      deliveryMethod,
    };

    if (discountType === 'voucher' && voucherCode.trim()) {
      payload.voucherCode = voucherCode.trim();
    } else if (discountType === 'promo' && promoCode.trim()) {
      payload.promoCode = promoCode.trim();
    }

    try {
      const order = await checkoutMutation.mutateAsync(payload);
      navigate(`/buyer/orders/${order.id}`);
    } catch (e: any) {
      setCheckoutError(e.message || 'Checkout failed. Please try again.');
    }
  };

  if (cartLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="h-64 bg-gray-200 rounded-xl" />
        </div>
      </div>
    );
  }

  if (cartError || !cart) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500">Failed to load cart.</p>
            <Link to="/buyer/cart" className="text-primary-600 hover:text-primary-700 mt-4 inline-block">
              Back to cart
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Checkout</h1>
        <Card>
          <div className="text-center py-12">
            <p className="text-lg text-gray-600 mb-2">Your cart is empty</p>
            <p className="text-sm text-gray-500 mb-4">Add some items to your cart before checking out.</p>
            <Link to="/products">
              <Button>Browse Products</Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {checkoutError && (
        <Card>
          <div className="p-4 bg-red-50 text-red-700 rounded-lg text-sm" role="alert">
            {checkoutError}
          </div>
        </Card>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Address Selection */}
          <Card header={<h2 className="font-semibold text-gray-900">Shipping Address</h2>}>
            {addrLoading ? (
              <div className="animate-pulse space-y-3">
                <div className="h-16 bg-gray-200 rounded" />
                <div className="h-16 bg-gray-200 rounded" />
              </div>
            ) : addrError || !addresses || addresses.length === 0 ? (
              <div className="text-center py-6">
                <p className="text-gray-500 mb-3">No addresses found. Please add an address first.</p>
                <Link to="/buyer/addresses">
                  <Button size="sm">Add Address</Button>
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {addresses.map((addr) => (
                  <label
                    key={addr.id}
                    className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      selectedAddressId === addr.id
                        ? 'border-primary-500 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <input
                      type="radio"
                      name="address"
                      value={addr.id}
                      checked={selectedAddressId === addr.id}
                      onChange={() => setSelectedAddressId(addr.id)}
                      className="sr-only"
                    />
                    <div className="flex items-start gap-3">
                      <div className={`mt-0.5 w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        selectedAddressId === addr.id
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {selectedAddressId === addr.id && (
                          <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {addr.recipientName} — {addr.phone}
                        </p>
                        <p className="text-sm text-gray-600 mt-0.5">{addr.addressDetail}</p>
                        {addr.city && <p className="text-sm text-gray-500">{addr.city}{addr.province ? `, ${addr.province}` : ''}{addr.postalCode ? ` ${addr.postalCode}` : ''}</p>}
                        {addr.isDefault && (
                          <span className="inline-block mt-1 text-xs text-primary-600 font-medium">Default</span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}
                <div className="pt-2">
                  <Link to="/buyer/addresses" className="text-sm text-primary-600 hover:text-primary-700">
                    + Add new address
                  </Link>
                </div>
              </div>
            )}
          </Card>

          {/* Delivery Method */}
          <Card header={<h2 className="font-semibold text-gray-900">Delivery Method</h2>}>
            <div className="space-y-3">
              {(['REGULAR', 'NEXT_DAY', 'INSTANT'] as DeliveryMethod[]).map((method) => (
                <label
                  key={method}
                  className={`block p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                    deliveryMethod === method
                      ? 'border-primary-500 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="delivery"
                    value={method}
                    checked={deliveryMethod === method}
                    onChange={() => setDeliveryMethod(method)}
                    className="sr-only"
                  />
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        deliveryMethod === method
                          ? 'border-primary-500 bg-primary-500'
                          : 'border-gray-300'
                      }`}>
                        {deliveryMethod === method && (
                          <div className="w-full h-full rounded-full bg-white scale-[0.4]" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {method === 'INSTANT' ? 'Instant Delivery' : method === 'NEXT_DAY' ? 'Next Day Delivery' : 'Regular Delivery'}
                        </p>
                        <p className="text-xs text-gray-500">
                          {method === 'INSTANT' ? 'Fastest delivery • 6-hour SLA' : method === 'NEXT_DAY' ? 'Arrives next day • 24-hour SLA' : 'Standard delivery • 72-hour SLA'}
                        </p>
                      </div>
                    </div>
                    <span className="text-sm font-semibold text-gray-900">
                      {formatPrice(deliveryFee)}
                    </span>
                  </div>
                </label>
              ))}
            </div>
          </Card>

          {/* Discount */}
          <Card header={<h2 className="font-semibold text-gray-900">Voucher / Promo</h2>}>
            <p className="text-xs text-gray-500 mb-4">
              You can use either a voucher code or a promo code, but not both.
            </p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Voucher Code</label>
                <Input
                  placeholder="Enter voucher code"
                  value={voucherCode}
                  onChange={(e) => handleDiscountCodeChange(e.target.value, 'voucher')}
                  disabled={discountType === 'promo'}
                />
              </div>
              <div className="text-center text-xs text-gray-400">— or —</div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Promo Code</label>
                <Input
                  placeholder="Enter promo code"
                  value={promoCode}
                  onChange={(e) => handleDiscountCodeChange(e.target.value, 'promo')}
                  disabled={discountType === 'voucher'}
                />
              </div>

              {discountLoading && (
                <p className="text-sm text-gray-500">Validating code...</p>
              )}

              {discountError && (
                <p className="text-sm text-red-600">{discountError}</p>
              )}

              {!discountLoading && discountResult && debouncedDiscount && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-700 font-medium">
                    {discountResult.type === 'voucher' ? 'Voucher' : 'Promo'} applied: {discountResult.code}
                  </p>
                  <p className="text-xs text-green-600 mt-0.5">
                    Discount: {formatPrice(discountResult.discountAmount)}
                    {discountResult.type === 'voucher' && discountResult.maxDiscountAmount !== '0' && Number(discountResult.maxDiscountAmount) > 0 && (
                      <> (max {formatPrice(discountResult.maxDiscountAmount)})</>
                    )}
                  </p>
                </div>
              )}

              {!discountLoading && !discountResult && debouncedDiscount && (
                <p className="text-sm text-red-600">Invalid or expired discount code.</p>
              )}
            </div>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card header={<h2 className="font-semibold text-gray-900">Order Summary</h2>}>
            <div className="space-y-3">
              <div className="text-sm">
                {cart.items.slice(0, 3).map((item) => (
                  <div key={item.id} className="flex justify-between py-1">
                    <span className="text-gray-600 truncate max-w-[180px]">
                      {item.product.name} x{item.quantity}
                    </span>
                    <span className="text-gray-900 font-medium">
                      {formatPrice(Number(item.product.price) * item.quantity)}
                    </span>
                  </div>
                ))}
                {cart.items.length > 3 && (
                  <p className="text-xs text-gray-400 mt-1">+{cart.items.length - 3} more items</p>
                )}
              </div>

              <div className="border-t border-gray-200 pt-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatPrice(subtotal)}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-green-600">Discount</span>
                    <span className="text-green-600 font-medium">-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Delivery Fee</span>
                  <span className="font-medium">{formatPrice(deliveryFee)}</span>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">PPN (12%)</span>
                  <span className="font-medium">{formatPrice(ppnAmount)}</span>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-3">
                <div className="flex justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <span className="text-xl font-bold text-primary-600">{formatPrice(finalTotal)}</span>
                </div>
              </div>

              <p className="text-xs text-gray-400 text-center pt-2">
                * Estimated total. Final amount calculated by system.
              </p>

              <Button
                className="w-full"
                onClick={handleSubmit}
                loading={checkoutMutation.isPending}
                disabled={!selectedAddressId || (addrLoading || !addresses || addresses.length === 0) || checkoutMutation.isPending}
              >
                Place Order
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
