export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-lg font-bold text-primary-600">SEAPEDIA</div>
          <p className="text-sm text-gray-500">&copy; {new Date().getFullYear()} SEAPEDIA. All rights reserved.</p>
          <p className="text-sm text-gray-400">COMPFEST SEA 2026</p>
        </div>
      </div>
    </footer>
  );
}
