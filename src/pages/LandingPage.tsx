import { Link, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/auth';
import { useReviews } from '../hooks/useReviews';
import { useProducts } from '../hooks/useProducts';
import Rating from '../components/ui/Rating';
import Card from '../components/ui/Card';
import { formatPrice } from '../types';

const steps = [
  {
    number: '01',
    emoji: '\u{1F6D2}',
    title: 'Telusuri & pilih',
    description: 'Temukan produk dari ratusan toko dalam satu marketplace, lengkap dengan ulasan pembeli asli.',
  },
  {
    number: '02',
    emoji: '\u{1F4B3}',
    title: 'Bayar dengan aman',
    description: 'Pembayaran lewat wallet dengan rincian biaya yang transparan, tanpa kejutan di akhir.',
  },
  {
    number: '03',
    emoji: '\u{1F69A}',
    title: 'Terima di depan pintu',
    description: 'Pilih metode pengantaran yang sesuai dan pantau posisi driver secara real-time.',
  },
];

const faqItems = [
  {
    question: 'Apa itu SEAPEDIA?',
    answer: 'SEAPEDIA adalah marketplace yang menghubungkan pembeli, penjual, dan driver dalam satu alur transaksi yang terpadu dan transparan.',
  },
  {
    question: 'Apakah saya harus memiliki wallet untuk berbelanja?',
    answer: 'Ya, pembayaran dilakukan melalui wallet agar transaksi lebih aman, tercatat, dan transparan bagi semua pihak.',
  },
  {
    question: 'Siapa saja yang bisa menggunakan SEAPEDIA?',
    answer: 'Pengguna dapat memiliki role Buyer, Seller, Driver, atau Admin sesuai akses yang diberikan saat pendaftaran.',
  },
  {
    question: 'Bagaimana proses pengiriman pesanan?',
    answer: 'Setelah seller memproses pesanan, driver dapat mengambil pekerjaan pengiriman dan menyelesaikannya hingga ke alamat tujuan.',
  },
  {
    question: 'Apakah saya bisa menjadi seller?',
    answer: 'Ya, pengguna dengan role Seller dapat mengelola toko, produk, dan pesanan melalui dashboard khusus seller.',
  },
  {
    question: 'Bagaimana cara melihat status pesanan?',
    answer: 'Buyer dapat melihat status pesanan secara real-time melalui halaman Orders setelah melakukan checkout.',
  },
];

const PRODUCTS_TO_SHOW = 4;

function getStockLabel(stock: number): { label: string; className: string } {
  if (stock > 10) return { label: 'Tersedia', className: 'bg-emerald-50 text-emerald-700 border-emerald-200/50' };
  if (stock > 0) return { label: 'Sisa sedikit', className: 'bg-amber-50 text-amber-700 border-amber-200/50' };
  return { label: 'Habis', className: 'bg-red-50 text-red-700 border-red-200/50' };
}

const ROLE_START_PAGE: Record<string, string> = {
  Admin: '/dashboard/admin',
  Seller: '/dashboard/seller',
  Buyer: '/products',
  Driver: '/dashboard/driver',
};

export default function LandingPage() {
  const { isAuthenticated, activeRole, roles } = useAuthStore();

  if (isAuthenticated) {
    if (activeRole) {
      return <Navigate to={ROLE_START_PAGE[activeRole] || '/products'} replace />;
    }
    return <Navigate to="/role-selection" replace />;
  }

  const { data: reviews } = useReviews();
  const { data: products, isLoading: productsLoading, isError: productsError } = useProducts();

  const featuredProducts = products?.filter((p) => !p.deletedAt).slice(0, PRODUCTS_TO_SHOW) || [];

  return (
    <div className='-mt-16'>

      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white overflow-hidden">
        <svg
          className="absolute inset-0 w-full h-full opacity-[0.07] pointer-events-none"
          viewBox="0 0 800 600"
          preserveAspectRatio="xMidYMid slice"
          aria-hidden="true"
        >
          <circle cx="700" cy="80" r="220" fill="white" />
          <circle cx="60" cy="540" r="160" fill="white" />
        </svg>

        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-3xl">
            <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-wide text-primary-100 bg-white/10 border border-white/20 rounded-full px-3 py-1 mb-6">
              Marketplace terpadu untuk semua peran
            </p>
            <h1 className="text-4xl md:text-6xl font-bold leading-[1.05] mb-6 tracking-tight">
              Belanja, jual, dan antar.
              <br className="hidden md:block" />
              Semua jadi <span className="text-yellow-300">satu jalur</span>.
            </h1>
            <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-xl leading-relaxed">
              SEAPEDIA menyatukan Seller, Buyer, dan Driver dalam satu alur
              transaksi yang mengalir, dari etalase sampai ke depan pintu.
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/products"
                className="inline-flex items-center px-6 py-3.5 bg-white text-primary-700 font-semibold rounded-lg hover:bg-primary-50 transition-colors shadow-sm"
              >
                Telusuri produk
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-6 py-3.5 border-2 border-white/70 text-white font-semibold rounded-lg hover:bg-white/10 hover:border-white transition-colors"
              >
                Mulai sekarang
              </Link>
            </div>
          </div>
        </div>

        <svg
          className="block w-full text-white"
          viewBox="0 0 1440 60"
          preserveAspectRatio="none"
          style={{ height: 48 }}
          aria-hidden="true"
        >
          <path d="M0 60 C 360 0, 1080 0, 1440 60 Z" fill="currentColor" />
        </svg>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
          <div>
            <p className="text-sm font-semibold text-primary-600 mb-3 tracking-wide">
              Produk pilihan
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Produk pilihan di SEAPEDIA
            </h2>
            <p className="text-gray-500 mt-2 max-w-xl">
              Jelajahi berbagai produk dari seller terpercaya di SEAPEDIA.
            </p>
          </div>
          <Link
            to="/products"
            className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 font-semibold text-sm whitespace-nowrap transition-colors"
          >
            Lihat semua produk
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </Link>
        </div>

        {productsLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 overflow-hidden animate-pulse">
                <div className="aspect-square bg-gray-100" />
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-100 rounded w-3/4" />
                  <div className="h-3 bg-gray-100 rounded w-1/2" />
                  <div className="h-5 bg-gray-100 rounded w-1/3" />
                  <div className="h-4 bg-gray-100 rounded w-1/4" />
                </div>
              </div>
            ))}
          </div>
        ) : productsError ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Gagal memuat produk. Silakan coba lagi nanti.</p>
          </div>
        ) : featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => {
              const stockInfo = getStockLabel(product.stock);
              return (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="aspect-square bg-gray-50 overflow-hidden">
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt={product.name}
                        loading="lazy"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <svg className="w-14 h-14 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <span className={`inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border ${stockInfo.className}`}>
                      {stockInfo.label}
                    </span>
                    <h3 className="font-semibold text-gray-900 text-sm mt-2 mb-1 line-clamp-1 group-hover:text-primary-600 transition-colors">
                      {product.name}
                    </h3>
                    <p className="text-xs text-gray-500 truncate mb-2">
                      {product.store.name}
                    </p>
                    <p className="text-lg font-bold text-primary-600">
                      {formatPrice(product.price)}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : null}

        {!productsLoading && !productsError && featuredProducts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">Belum ada produk tersedia saat ini.</p>
          </div>
        )}
      </section>

      {/* How it works - the "seamless path" signature element */}
      <section className="max-w-7xl mx-auto px-4 pt-4 pb-20 md:pb-28">
        <div className="max-w-2xl mb-14">
          <p className="text-sm font-semibold text-primary-600 mb-3 tracking-wide">
            Bagaimana alurnya
          </p>
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
            Tiga langkah, satu pengalaman yang mengalir
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6 md:gap-5 items-stretch">
          {steps.map((step, idx) => {
            const isLast = idx === steps.length - 1;
            return (
              <div key={step.number} className="flex items-center md:items-stretch">
                <div className="group relative flex-1 rounded-2xl border border-gray-200 bg-white p-6 pt-8 transition-all duration-300 hover:-translate-y-1 hover:border-primary-200 hover:shadow-lg hover:shadow-gray-200/60">
                  {/* Number badge, overlapping the top edge */}
                  <span className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full bg-primary-600 text-sm font-bold text-white ring-4 ring-white">
                    {idx + 1}
                  </span>

                  <div className="mb-5 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-primary-50 text-3xl transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    {step.emoji}
                  </div>

                  <h3 className="font-semibold text-lg text-gray-900 mb-2">{step.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{step.description}</p>
                </div>

                {/* Connector arrow between cards, desktop only */}
                {!isLast && (
                  <div className="hidden md:flex items-center justify-center w-5 shrink-0">
                    <svg
                      className="w-5 h-5 text-primary-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* Reviews */}
      {reviews && reviews.length > 0 && (
        <section className="bg-gray-50 py-20 md:py-28 border-t border-gray-100">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">
              <div>
                <p className="text-sm font-semibold text-primary-600 mb-3 tracking-wide">
                  Kata mereka
                </p>
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
                  Apa kata pengguna SEAPEDIA
                </h2>
              </div>
              <Link
                to="/reviews"
                className="text-primary-600 hover:text-primary-700 font-semibold text-sm whitespace-nowrap"
              >
                Lihat semua ulasan &rarr;
              </Link>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {reviews.slice(0, 6).map((review) => (
                <Card key={review.id}>
                  <div className="flex items-center gap-2 mb-4">
                    <Rating value={review.rating} readonly size="sm" />
                  </div>
                  <p className="text-gray-700 text-[15px] leading-relaxed mb-5">
                    &ldquo;{review.comment}&rdquo;
                  </p>
                  <p className="text-sm font-semibold text-gray-900">- {review.reviewerName}</p>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      <section className="max-w-7xl mx-auto px-4 py-20 md:py-28">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-sm font-semibold text-primary-600 mb-3 tracking-wide">
              Tanya jawab
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 leading-tight">
              Pertanyaan yang sering diajukan
            </h2>
            <p className="text-gray-500 mt-2">
              Temukan jawaban cepat seputar SEAPEDIA.
            </p>
          </div>

          <div className="space-y-3">
            {faqItems.map((item, idx) => (
              <details
                key={idx}
                className="group bg-white rounded-xl border border-gray-200 overflow-hidden transition-shadow hover:shadow-sm"
              >
                <summary className="flex items-center justify-between gap-4 px-5 py-4 cursor-pointer list-none text-sm font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                  {item.question}
                  <svg
                    className="w-5 h-5 text-gray-400 shrink-0 transition-transform duration-200 group-open:rotate-180"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </summary>
                <div className="px-5 pb-4 text-sm text-gray-600 leading-relaxed">
                  {item.answer}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary-800 text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="text-center md:text-left">
            <h2 className="text-2xl md:text-3xl font-bold mb-2">
              Siap memulai dengan SEAPEDIA?
            </h2>
            <p className="text-primary-100">Daftar gratis, mulai berjualan atau berbelanja hari ini.</p>
          </div>
          <Link
            to="/register"
            className="inline-flex items-center px-7 py-3.5 bg-yellow-300 text-primary-900 font-semibold rounded-lg hover:bg-yellow-200 transition-colors whitespace-nowrap"
          >
            Buat akun gratis
          </Link>
        </div>
      </section>
    </div>
  );
}