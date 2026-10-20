import { SearchInput } from "@/components/SearchInput.jsx";
import { BrandsList } from "@/components/BrandsList.jsx";
import { OffersTable } from "@/components/OffersTable.jsx";

export const App = () => {
  return (
    <div className="container py-4" style={{ maxWidth: 1280 }}>
      <header className="mb-4">
        <h1 className="h3 mb-1">Поиск автозапчастей</h1>
        <p className="text-muted small mb-0">
          Введите артикул, выберите производителя и сравните цены
        </p>
      </header>

      <div className="row g-3">
        <aside className="col-12 col-lg-4">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <SearchInput />
              <BrandsList />
            </div>
          </div>
        </aside>

        <main className="col-12 col-lg-8">
          <div className="card shadow-sm h-100">
            <div className="card-body">
              <OffersTable />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};
