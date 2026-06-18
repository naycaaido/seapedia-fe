import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateProduct } from '../../hooks/useSeller';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';

export default function CreateProductPage() {
  const navigate = useNavigate();
  const createProduct = useCreateProduct();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};

    if (!name.trim()) errors.name = 'Product name is required';
    if (!description.trim()) errors.description = 'Description is required';
    if (!price || Number(price) < 0) errors.price = 'Price must be 0 or greater';
    if (!stock || Number(stock) < 0) errors.stock = 'Stock must be 0 or greater';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setFormErrors({});

    try {
      await createProduct.mutateAsync({
        name: name.trim(),
        description: description.trim(),
        price: Number(price),
        stock: Number(stock),
        imageUrl: imageUrl.trim() || undefined,
      });
      navigate('/seller/products');
    } catch {
      setFormErrors({ general: 'Failed to create product. Please try again.' });
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Create Product</h1>
      <p className="text-gray-500 mb-8">Add a new product to your store.</p>

      <Card>
        {formErrors.general && (
          <p className="text-sm text-red-600 mb-4">{formErrors.general}</p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            label="Product Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            error={formErrors.name}
            placeholder="e.g. Headphone Bluetooth"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Describe your product..."
            />
            {formErrors.description && (
              <p className="text-sm text-red-600 mt-1">{formErrors.description}</p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Price (Rp)"
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              error={formErrors.price}
              placeholder="e.g. 350000"
            />
            <Input
              label="Stock"
              type="number"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              error={formErrors.stock}
              placeholder="e.g. 25"
            />
          </div>
          <Input
            label="Image URL (optional)"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            placeholder="https://example.com/image.jpg"
          />
          <div className="flex gap-3">
            <Button type="submit" loading={createProduct.isPending}>
              Create Product
            </Button>
            <Button type="button" variant="secondary" onClick={() => navigate('/seller/products')}>
              Cancel
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
