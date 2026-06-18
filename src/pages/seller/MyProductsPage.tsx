import { Link } from 'react-router-dom';
import { useSellerProducts, useDeleteProduct } from '../../hooks/useSeller';
import Card from '../../components/ui/Card';
import Button from '../../components/ui/Button';
import Badge from '../../components/ui/Badge';
import { formatPrice } from '../../types';

export default function MyProductsPage() {
  const { data: products, isLoading } = useSellerProducts();
  const deleteProduct = useDeleteProduct();

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to deactivate this product? It will no longer appear in the public catalog.')) {
      await deleteProduct.mutateAsync(id);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Products</h1>
          <p className="text-gray-500">Manage your product catalog.</p>
        </div>
        <Link to="/seller/products/new">
          <Button>Add Product</Button>
        </Link>
      </div>

      {products && products.length > 0 ? (
        <div className="space-y-4">
          {products.map((product) => (
            <Card key={product.id}>
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-900">{product.name}</h3>
                      {!product.deletedAt ? (
                        <Badge variant="green" size="sm">Active</Badge>
                      ) : (
                        <Badge variant="gray" size="sm">Deleted</Badge>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                      {product.description}
                    </p>
                    <div className="flex gap-4 text-sm text-gray-500">
                      <span>{formatPrice(product.price)}</span>
                      <span>Stock: {product.stock}</span>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 ml-4">
                  {!product.deletedAt && (
                    <Link to={`/seller/products/${product.id}/edit`}>
                      <Button variant="secondary" size="sm">Edit</Button>
                    </Link>
                  )}
                  {!product.deletedAt && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleDelete(product.id)}
                      loading={deleteProduct.isPending}
                    >
                      Deactivate
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">You don&apos;t have any products yet.</p>
            <Link to="/seller/products/new">
              <Button>Create Your First Product</Button>
            </Link>
          </div>
        </Card>
      )}
    </div>
  );
}
