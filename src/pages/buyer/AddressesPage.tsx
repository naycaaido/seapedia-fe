import { useState } from 'react';
import {
  useAddresses,
  useCreateAddress,
  useUpdateAddress,
  useDeleteAddress,
  useSetDefaultAddress,
} from '../../hooks/useBuyer';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Badge from '../../components/ui/Badge';
import Modal from '../../components/ui/Modal';
import type { Address, CreateAddressPayload } from '../../types';

const emptyForm: CreateAddressPayload = {
  recipientName: '',
  phone: '',
  addressDetail: '',
  city: '',
  province: '',
  postalCode: '',
  isDefault: false,
};

export default function AddressesPage() {
  const { data: addresses, isLoading, error } = useAddresses();
  const createMutation = useCreateAddress();
  const updateMutation = useUpdateAddress();
  const deleteMutation = useDeleteAddress();
  const setDefaultMutation = useSetDefaultAddress();

  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<CreateAddressPayload>(emptyForm);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    if (!form.recipientName.trim()) errors.recipientName = 'Recipient name is required.';
    if (!form.phone.trim()) errors.phone = 'Phone is required.';
    if (!form.addressDetail.trim()) errors.addressDetail = 'Address detail is required.';
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setFormErrors({});
    setShowForm(false);
  };

  const handleOpenCreate = () => {
    resetForm();
    setShowForm(true);
  };

  const handleOpenEdit = (addr: Address) => {
    setForm({
      recipientName: addr.recipientName,
      phone: addr.phone,
      addressDetail: addr.addressDetail,
      city: addr.city || '',
      province: addr.province || '',
      postalCode: addr.postalCode || '',
      isDefault: addr.isDefault,
    });
    setEditingId(addr.id);
    setFormErrors({});
    setShowForm(true);
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    try {
      if (editingId) {
        await updateMutation.mutateAsync({ id: editingId, payload: form });
      } else {
        await createMutation.mutateAsync(form);
      }
      resetForm();
    } catch {
      // mutation error handled
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteMutation.mutateAsync(id);
      setDeletingId(null);
    } catch {
      // handled
    }
  };

  const handleSetDefault = async (id: number) => {
    try {
      await setDefaultMutation.mutateAsync(id);
    } catch {
      // handled
    }
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-gray-200 rounded" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">My Addresses</h1>
        <Card>
          <div className="text-center py-8">
            <p className="text-red-600 mb-2">Failed to load addresses.</p>
            <p className="text-sm text-gray-500">{error.message}</p>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Addresses</h1>
          <p className="text-gray-500 mt-1">Manage your shipping addresses.</p>
        </div>
        <Button onClick={handleOpenCreate}>Add Address</Button>
      </div>

      {!addresses || addresses.length === 0 ? (
        <Card>
          <div className="text-center py-12">
            <p className="text-gray-500 mb-4">No addresses yet.</p>
            <Button onClick={handleOpenCreate}>Add Your First Address</Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {addresses.map((addr) => (
            <Card key={addr.id}>
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-medium text-gray-900">{addr.recipientName}</p>
                    {addr.isDefault && <Badge variant="green">Default</Badge>}
                  </div>
                  <p className="text-sm text-gray-600">{addr.phone}</p>
                  <p className="text-sm text-gray-600 mt-1">{addr.addressDetail}</p>
                  {(addr.city || addr.province || addr.postalCode) && (
                    <p className="text-sm text-gray-500 mt-0.5">
                      {[addr.city, addr.province, addr.postalCode].filter(Boolean).join(', ')}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 ml-4">
                  {!addr.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSetDefault(addr.id)}
                      loading={setDefaultMutation.isPending}
                    >
                      Set Default
                    </Button>
                  )}
                  <Button variant="secondary" size="sm" onClick={() => handleOpenEdit(addr)}>
                    Edit
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => setDeletingId(addr.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Create / Edit Modal */}
      <Modal
        isOpen={showForm}
        onClose={resetForm}
        title={editingId ? 'Edit Address' : 'Add Address'}
      >
        <div className="space-y-4">
          <Input
            label="Recipient Name"
            value={form.recipientName}
            onChange={(e) => setForm({ ...form, recipientName: e.target.value })}
            error={formErrors.recipientName}
          />
          <Input
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            error={formErrors.phone}
          />
          <Input
            label="Address Detail"
            value={form.addressDetail}
            onChange={(e) => setForm({ ...form, addressDetail: e.target.value })}
            error={formErrors.addressDetail}
          />
          <div className="grid grid-cols-3 gap-4">
            <Input
              label="City"
              value={form.city || ''}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
            />
            <Input
              label="Province"
              value={form.province || ''}
              onChange={(e) => setForm({ ...form, province: e.target.value })}
            />
            <Input
              label="Postal Code"
              value={form.postalCode || ''}
              onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
            />
          </div>
          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={form.isDefault || false}
              onChange={(e) => setForm({ ...form, isDefault: e.target.checked })}
              className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
            />
            <span className="text-sm text-gray-700">Set as default address</span>
          </label>
          <div className="flex justify-end gap-3 pt-2">
            <Button variant="ghost" onClick={resetForm}>Cancel</Button>
            <Button onClick={handleSubmit} loading={isMutating} disabled={isMutating}>
              {editingId ? 'Save Changes' : 'Add Address'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deletingId !== null}
        onClose={() => setDeletingId(null)}
        title="Delete Address"
      >
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete this address? This action cannot be undone.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setDeletingId(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => deletingId && handleDelete(deletingId)}
            loading={deleteMutation.isPending}
            disabled={deleteMutation.isPending}
          >
            Delete
          </Button>
        </div>
      </Modal>
    </div>
  );
}
