import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSellerStore, useCreateStore, useUpdateStore } from '../../hooks/useSeller';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function StoreManagementPage() {
  const navigate = useNavigate();
  const { data: store, isLoading: storeLoading } = useSellerStore();
  const createStore = useCreateStore();
  const updateStore = useUpdateStore();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isEditing, setIsEditing] = useState(false);

  const isCreating = !store && !storeLoading;

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Store name is required';
    if (name.trim().length < 2) errors.name = 'Store name must be at least 2 characters';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      await createStore.mutateAsync({ name: name.trim(), description: description.trim() });
      navigate('/dashboard/seller');
    } catch {
      setFormErrors({ general: 'Failed to create store. The name may already be taken.' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!name.trim()) errors.name = 'Store name is required';
    if (name.trim().length < 2) errors.name = 'Store name must be at least 2 characters';
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      await updateStore.mutateAsync({ name: name.trim(), description: description.trim() });
      setIsEditing(false);
    } catch {
      setFormErrors({ general: 'Failed to update store. The name may already be taken.' });
    }
  };

  if (storeLoading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  if (isCreating) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Your Store</h1>
        <p className="text-gray-500 mb-8">Set up your store to start selling products.</p>

        <Card>
          {formErrors.general && (
            <p className="text-sm text-red-600 mb-4">{formErrors.general}</p>
          )}
          <form onSubmit={handleCreate} className="space-y-4">
            <Input
              label="Store Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={formErrors.name}
              placeholder="e.g. Toko Berkah"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Describe your store..."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" loading={createStore.isPending}>
                Create Store
              </Button>
              <Button type="button" variant="secondary" onClick={() => navigate('/dashboard/seller')}>
                Cancel
              </Button>
            </div>
          </form>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Store Management</h1>
      <p className="text-gray-500 mb-8">Manage your store profile.</p>

      <Card>
        {formErrors.general && (
          <p className="text-sm text-red-600 mb-4">{formErrors.general}</p>
        )}

        {isEditing ? (
          <form onSubmit={handleUpdate} className="space-y-4">
            <Input
              label="Store Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={formErrors.name}
              placeholder="e.g. Toko Berkah"
            />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                rows={3}
                placeholder="Describe your store..."
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" loading={updateStore.isPending}>
                Save Changes
              </Button>
              <Button type="button" variant="secondary" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
            </div>
          </form>
        ) : (
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Store Name</p>
              <p className="text-lg font-medium text-gray-900">{store?.name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Description</p>
              <p className="text-gray-700">{store?.description || 'No description provided.'}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-gray-700">
                {store?.createdAt ? new Date(store.createdAt).toLocaleDateString() : '-'}
              </p>
            </div>
            <Button onClick={() => {
              setName(store?.name || '');
              setDescription(store?.description || '');
              setIsEditing(true);
            }}>
              Edit Store
            </Button>
          </div>
        )}
      </Card>
    </div>
  );
}
