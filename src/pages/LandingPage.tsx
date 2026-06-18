import { Link } from 'react-router-dom';
import { useReviews } from '../hooks/useReviews';
import Rating from '../components/ui/Rating';
import Card from '../components/ui/Card';

export default function LandingPage() {
  const { data: reviews } = useReviews();

  return (
    <div>
      <section className="bg-gradient-to-br from-primary-600 to-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-20 md:py-28">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Welcome to <span className="text-yellow-300">SEAPEDIA</span>
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-8">
              The complete marketplace ecosystem connecting Sellers, Buyers, Drivers, and Admins
              in one seamless experience.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors"
              >
                Browse Products
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition-colors"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 py-16">
        <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">Why SEAPEDIA?</h2>
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="text-center">
            <div className="text-3xl mb-3">&#128722;</div>
            <h3 className="font-semibold text-lg mb-2">Browse & Shop</h3>
            <p className="text-gray-600 text-sm">Discover products from multiple stores in one marketplace.</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-3">&#128179;</div>
            <h3 className="font-semibold text-lg mb-2">Secure Checkout</h3>
            <p className="text-gray-600 text-sm">Wallet-based payments with transparent fee calculation.</p>
          </Card>
          <Card className="text-center">
            <div className="text-3xl mb-3">&#128666;</div>
            <h3 className="font-semibold text-lg mb-2">Fast Delivery</h3>
            <p className="text-gray-600 text-sm">Multiple delivery methods with real-time tracking.</p>
          </Card>
        </div>
      </section>

      {reviews && reviews.length > 0 && (
        <section className="bg-gray-50 py-16">
          <div className="max-w-7xl mx-auto px-4">
            <h2 className="text-2xl font-bold text-gray-900 mb-8 text-center">What People Say</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <Card key={review.id}>
                  <div className="flex items-center gap-2 mb-2">
                    <Rating value={review.rating} readonly size="sm" />
                  </div>
                  <p className="text-gray-700 text-sm mb-3">&ldquo;{review.comment}&rdquo;</p>
                  <p className="text-sm font-medium text-gray-900">- {review.reviewerName}</p>
                </Card>
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/reviews" className="text-primary-600 hover:text-primary-700 font-medium">
                Read all reviews &rarr;
              </Link>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
