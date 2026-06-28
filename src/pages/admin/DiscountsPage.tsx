import { useState } from 'react';
import { useAdminDiscounts, useCreateVoucher, useCreatePromo } from '../../hooks/useAdmin';
import Card from '../../components/ui/Card';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import { formatPrice } from '../../types';
import type { CreateVoucherPayload, CreatePromoPayload } from '../../types';

const initialVoucherForm: CreateVoucherPayload = {
  name: '',
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  remainingUsage: 1,
  expiryDate: '',
  isActive: true,
};

const initialPromoForm: CreatePromoPayload = {
  name: '',
  code: '',
  discountType: 'PERCENTAGE',
  discountValue: 0,
  expiryDate: '',
  isActive: true,
};

export default function DiscountsPage() {
  const { data, isLoading, isError, error } = useAdminDiscounts();
  const createVoucher = useCreateVoucher();
  const createPromo = useCreatePromo();

  const [voucherForm, setVoucherForm] = useState<CreateVoucherPayload>(initialVoucherForm);
  const [promoForm, setPromoForm] = useState<CreatePromoPayload>(initialPromoForm);
  const [voucherError, setVoucherError] = useState('');
  const [promoError, setPromoError] = useState('');
  const [voucherSuccess, setVoucherSuccess] = useState('');
  const [promoSuccess, setPromoSuccess] = useState('');

  function validateVoucher(): boolean {
    if (!voucherForm.name.trim()) { setVoucherError('Name is required'); return false; }
    if (!voucherForm.code.trim()) { setVoucherError('Code is required'); return false; }
    if (voucherForm.discountValue <= 0) { setVoucherError('Discount value must be > 0'); return false; }
    if (voucherForm.remainingUsage < 1) { setVoucherError('Remaining usage must be >= 1'); return false; }
    if (!voucherForm.expiryDate) { setVoucherError('Expiry date is required'); return false; }
    return true;
  }

  function validatePromo(): boolean {
    if (!promoForm.name.trim()) { setPromoError('Name is required'); return false; }
    if (!promoForm.code.trim()) { setPromoError('Code is required'); return false; }
    if (promoForm.discountValue <= 0) { setPromoError('Discount value must be > 0'); return false; }
    if (!promoForm.expiryDate) { setPromoError('Expiry date is required'); return false; }
    return true;
  }

  async function handleCreateVoucher() {
    setVoucherError('');
    setVoucherSuccess('');
    if (!validateVoucher()) return;
    try {
      await createVoucher.mutateAsync(voucherForm);
      setVoucherSuccess(`Voucher "${voucherForm.code}" created successfully!`);
      setVoucherForm(initialVoucherForm);
    } catch (e: any) {
      setVoucherError(e.message || 'Failed to create voucher');
    }
  }

  async function handleCreatePromo() {
    setPromoError('');
    setPromoSuccess('');
    if (!validatePromo()) return;
    try {
      await createPromo.mutateAsync(promoForm);
      setPromoSuccess(`Promo "${promoForm.code}" created successfully!`);
      setPromoForm(initialPromoForm);
    } catch (e: any) {
      setPromoError(e.message || 'Failed to create promo');
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Discounts</h1>

      <div className="grid lg:grid-cols-2 gap-8 mb-8">
        <Card header={<h2 className="font-semibold text-gray-900">Vouchers</h2>}>
          {isLoading && <div className="animate-pulse h-32 bg-gray-200 rounded" />}
          {isError && (
            <div className="text-red-600 text-sm">{(error as Error)?.message}</div>
          )}
          {!isLoading && !isError && data && data.vouchers.length === 0 && (
            <p className="text-gray-500 text-sm">No vouchers found.</p>
          )}
          {!isLoading && !isError && data && data.vouchers.length > 0 && (
            <div className="space-y-2">
              {data.vouchers.map((v) => (
                <div key={v.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{v.code}</p>
                    <p className="text-gray-500">{v.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">
                      {v.discountType === 'PERCENTAGE' ? `${v.discountValue}%` : formatPrice(v.discountValue)}
                    </p>
                    <Badge variant={v.isAvailable ? 'green' : 'red'}>
                      {v.isAvailable ? 'Available' : 'Expired'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Promos</h2>}>
          {isLoading && <div className="animate-pulse h-32 bg-gray-200 rounded" />}
          {isError && (
            <div className="text-red-600 text-sm">{(error as Error)?.message}</div>
          )}
          {!isLoading && !isError && data && data.promos.length === 0 && (
            <p className="text-gray-500 text-sm">No promos found.</p>
          )}
          {!isLoading && !isError && data && data.promos.length > 0 && (
            <div className="space-y-2">
              {data.promos.map((p) => (
                <div key={p.id} className="flex items-center justify-between py-2 border-b last:border-0 text-sm">
                  <div>
                    <p className="font-medium text-gray-900">{p.code}</p>
                    <p className="text-gray-500">{p.name}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-gray-900">
                      {p.discountType === 'PERCENTAGE' ? `${p.discountValue}%` : formatPrice(p.discountValue)}
                    </p>
                    <Badge variant={p.isAvailable ? 'green' : 'red'}>
                      {p.isAvailable ? 'Available' : 'Expired'}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <Card header={<h2 className="font-semibold text-gray-900">Create Voucher</h2>}>
          {voucherSuccess && (
            <div role="alert" className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
              {voucherSuccess}
            </div>
          )}
          {voucherError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {voucherError}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Name"
              value={voucherForm.name}
              onChange={(e) => setVoucherForm({ ...voucherForm, name: e.target.value })}
              placeholder="Diskon 10%"
            />
            <Input
              label="Code"
              value={voucherForm.code}
              onChange={(e) => setVoucherForm({ ...voucherForm, code: e.target.value.toUpperCase() })}
              placeholder="DISKON10"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={voucherForm.discountType}
                onChange={(e) => setVoucherForm({ ...voucherForm, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>
            <Input
              label={voucherForm.discountType === 'PERCENTAGE' ? 'Discount Value (%)' : 'Discount Value (Rp)'}
              type="number"
              value={voucherForm.discountValue || ''}
              onChange={(e) => setVoucherForm({ ...voucherForm, discountValue: Number(e.target.value) })}
              min={0}
            />
            {voucherForm.discountType === 'PERCENTAGE' && (
              <Input
                label="Max Discount Amount (Rp, optional)"
                type="number"
                value={voucherForm.maxDiscountAmount || ''}
                onChange={(e) => setVoucherForm({ ...voucherForm, maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined })}
                min={0}
              />
            )}
            <Input
              label="Min Purchase Amount (Rp, optional)"
              type="number"
              value={voucherForm.minPurchaseAmount || ''}
              onChange={(e) => setVoucherForm({ ...voucherForm, minPurchaseAmount: e.target.value ? Number(e.target.value) : undefined })}
              min={0}
            />
            <Input
              label="Remaining Usage"
              type="number"
              value={voucherForm.remainingUsage}
              onChange={(e) => setVoucherForm({ ...voucherForm, remainingUsage: Number(e.target.value) })}
              min={1}
            />
            <Input
              label="Expiry Date"
              type="datetime-local"
              value={voucherForm.expiryDate ? voucherForm.expiryDate.slice(0, 16) : ''}
              onChange={(e) => setVoucherForm({ ...voucherForm, expiryDate: e.target.value ? `${e.target.value}:00Z` : '' })}
            />
            <Button
              onClick={handleCreateVoucher}
              loading={createVoucher.isPending}
              disabled={createVoucher.isPending}
              className="w-full"
            >
              Create Voucher
            </Button>
          </div>
        </Card>

        <Card header={<h2 className="font-semibold text-gray-900">Create Promo</h2>}>
          {promoSuccess && (
            <div role="alert" className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg mb-4 text-sm">
              {promoSuccess}
            </div>
          )}
          {promoError && (
            <div role="alert" className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg mb-4 text-sm">
              {promoError}
            </div>
          )}
          <div className="space-y-4">
            <Input
              label="Name"
              value={promoForm.name}
              onChange={(e) => setPromoForm({ ...promoForm, name: e.target.value })}
              placeholder="Cashback 20%"
            />
            <Input
              label="Code"
              value={promoForm.code}
              onChange={(e) => setPromoForm({ ...promoForm, code: e.target.value.toUpperCase() })}
              placeholder="CASHBACK20"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount Type</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={promoForm.discountType}
                onChange={(e) => setPromoForm({ ...promoForm, discountType: e.target.value as 'PERCENTAGE' | 'FIXED_AMOUNT' })}
              >
                <option value="PERCENTAGE">Percentage</option>
                <option value="FIXED_AMOUNT">Fixed Amount</option>
              </select>
            </div>
            <Input
              label={promoForm.discountType === 'PERCENTAGE' ? 'Discount Value (%)' : 'Discount Value (Rp)'}
              type="number"
              value={promoForm.discountValue || ''}
              onChange={(e) => setPromoForm({ ...promoForm, discountValue: Number(e.target.value) })}
              min={0}
            />
            {promoForm.discountType === 'PERCENTAGE' && (
              <Input
                label="Max Discount Amount (Rp, optional)"
                type="number"
                value={promoForm.maxDiscountAmount || ''}
                onChange={(e) => setPromoForm({ ...promoForm, maxDiscountAmount: e.target.value ? Number(e.target.value) : undefined })}
                min={0}
              />
            )}
            <Input
              label="Min Purchase Amount (Rp, optional)"
              type="number"
              value={promoForm.minPurchaseAmount || ''}
              onChange={(e) => setPromoForm({ ...promoForm, minPurchaseAmount: e.target.value ? Number(e.target.value) : undefined })}
              min={0}
            />
            <Input
              label="Expiry Date"
              type="datetime-local"
              value={promoForm.expiryDate ? promoForm.expiryDate.slice(0, 16) : ''}
              onChange={(e) => setPromoForm({ ...promoForm, expiryDate: e.target.value ? `${e.target.value}:00Z` : '' })}
            />
            <Button
              onClick={handleCreatePromo}
              loading={createPromo.isPending}
              disabled={createPromo.isPending}
              className="w-full"
            >
              Create Promo
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}
