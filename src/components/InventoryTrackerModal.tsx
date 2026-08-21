import React, { useState } from 'react';
import {
  X,
  Activity,
  Package,
  Plus,
  RefreshCw,
  AlertTriangle,
  CheckCircle2,
  TrendingDown,
  Warehouse,
  Flame,
  Search,
  Sliders,
  Play,
  Pause,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { useStore } from '../context/StoreContext';
import { WAREHOUSE_AISLES } from '../data/products';

export const InventoryTrackerModal: React.FC = () => {
  const {
    products,
    inventoryLogs,
    isInventoryModalOpen,
    setIsInventoryModalOpen,
    restockProduct,
    adjustProductStock,
    resetAllInventory,
    isSimulatingLiveShoppers,
    toggleLiveShopperSimulation,
  } = useStore();

  const [tableSearch, setTableSearch] = useState('');
  const [selectedAisle, setSelectedAisle] = useState('ALL');
  const [editingStockId, setEditingStockId] = useState<string | null>(null);
  const [tempStockValue, setTempStockValue] = useState<number>(0);

  if (!isInventoryModalOpen) return null;

  const totalSKUs = products.length;
  const totalUnits = products.reduce((acc, p) => acc + p.inStock, 0);
  const lowStockProducts = products.filter(p => p.inStock > 0 && p.inStock <= 8);
  const outOfStockProducts = products.filter(p => p.inStock === 0);

  const filteredProducts = products.filter(p => {
    const matchesAisle = selectedAisle === 'ALL' || p.aisle.includes(`Aisle ${selectedAisle}`);
    const matchesSearch = p.name.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.sku.toLowerCase().includes(tableSearch.toLowerCase()) ||
      p.aisle.toLowerCase().includes(tableSearch.toLowerCase());
    return matchesAisle && matchesSearch;
  });

  const handleStartEdit = (id: string, currentStock: number) => {
    setEditingStockId(id);
    setTempStockValue(currentStock);
  };

  const handleSaveStock = (id: string) => {
    adjustProductStock(id, tempStockValue);
    setEditingStockId(null);
  };

  return (
    <div
      id="inventory-tracker-modal"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200"
    >
      <div className="bg-white w-full max-w-5xl max-h-[90vh] rounded-2xl shadow-2xl border border-slate-200 flex flex-col overflow-hidden">
        
        {/* Modal Header */}
        <div className="bg-slate-900 text-white px-6 py-4 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-lg border border-emerald-500/30">
              <Activity className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight text-white">
                  Real-Time Warehouse Inventory Tracker
                </h2>
                <span className="bg-emerald-500/20 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded border border-emerald-500/40">
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Aisle telemetry, stock audits, automated reservation engine & replenishment
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Live Shopper Engine Toggle */}
            <button
              onClick={toggleLiveShopperSimulation}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer border ${
                isSimulatingLiveShoppers
                  ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50 hover:bg-emerald-900'
                  : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Toggle automatic live shopper simulation"
            >
              {isSimulatingLiveShoppers ? (
                <>
                  <Pause className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Simulating Shoppers (ON)</span>
                </>
              ) : (
                <>
                  <Play className="w-3.5 h-3.5 text-slate-400" />
                  <span>Simulator Paused</span>
                </>
              )}
            </button>

            <button
              onClick={() => setIsInventoryModalOpen(false)}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
              aria-label="Close inventory modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Telemetry Metrics Bar */}
        <div className="bg-slate-800 text-slate-100 px-6 py-3 border-b border-slate-700 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div className="flex items-center gap-2.5">
            <Package className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Total SKUs</span>
              <span className="font-extrabold text-sm text-white font-mono">{totalSKUs} Items</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <Warehouse className="w-4 h-4 text-emerald-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Units In Stock</span>
              <span className="font-extrabold text-sm text-white font-mono">{totalUnits} Units</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Low Stock Alerts</span>
              <span className="font-extrabold text-sm text-amber-300 font-mono">{lowStockProducts.length} Items</span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <ShieldCheck className="w-4 h-4 text-rose-400" />
            <div>
              <span className="text-[10px] text-slate-400 block uppercase">Out of Stock</span>
              <span className="font-extrabold text-sm text-rose-300 font-mono">{outOfStockProducts.length} Items</span>
            </div>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Warehouse Aisles Overview Chips */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Warehouse Aisles Telemetry
              </h3>
              <span className="text-[11px] text-sky-600 font-medium">Click aisle to filter table</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2">
              <button
                onClick={() => setSelectedAisle('ALL')}
                className={`p-2.5 rounded-lg border text-left transition cursor-pointer text-xs font-semibold ${
                  selectedAisle === 'ALL'
                    ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-500'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="font-bold">All Aisles</div>
                <div className="text-[10px] text-slate-500">6 Sections Active</div>
              </button>

              {WAREHOUSE_AISLES.map((aisle) => (
                <button
                  key={aisle.id}
                  onClick={() => setSelectedAisle(aisle.id)}
                  className={`p-2.5 rounded-lg border text-left transition cursor-pointer text-xs ${
                    selectedAisle === aisle.id
                      ? 'bg-sky-50 border-sky-500 text-sky-900 ring-1 ring-sky-500'
                      : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="font-bold text-slate-900 flex items-center justify-between">
                    <span>Aisle {aisle.id}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                  </div>
                  <div className="text-[10px] text-slate-500 truncate">{aisle.status}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Search and Table Controls */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="relative w-full sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={tableSearch}
                onChange={(e) => setTableSearch(e.target.value)}
                placeholder="Search SKU, name, aisle..."
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs text-slate-800 placeholder-slate-400 focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <button
                onClick={resetAllInventory}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 transition cursor-pointer shadow-2xs"
                title="Reset all products stock levels to factory baseline"
              >
                <RefreshCw className="w-3.5 h-3.5 text-slate-500" />
                <span>Reset All to Baseline</span>
              </button>
            </div>
          </div>

          {/* Stock Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead className="bg-slate-100 text-[11px] font-bold uppercase text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Product & SKU</th>
                    <th className="px-3 py-3">Aisle Location</th>
                    <th className="px-4 py-3">Stock Gauge</th>
                    <th className="px-3 py-3 text-center">Available Units</th>
                    <th className="px-4 py-3 text-right">Quick Restock / Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 bg-white">
                  {filteredProducts.map((p) => {
                    const stockPercent = Math.min(100, Math.round((p.inStock / p.maxStock) * 100));
                    const isLow = p.inStock > 0 && p.inStock <= 8;
                    const isOut = p.inStock === 0;

                    return (
                      <tr key={p.id} className="hover:bg-sky-50/40 transition">
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-9 h-9 object-cover rounded border border-slate-200 shrink-0"
                            />
                            <div>
                              <div className="font-bold text-slate-900 line-clamp-1">{p.name}</div>
                              <div className="font-mono text-[10px] text-slate-400">
                                SKU: {p.sku} | ${p.price.toFixed(2)}
                              </div>
                            </div>
                          </div>
                        </td>

                        <td className="px-3 py-3 whitespace-nowrap">
                          <span className="bg-slate-100 text-slate-700 font-mono text-[11px] font-semibold px-2 py-0.5 rounded border border-slate-200">
                            {p.aisle}
                          </span>
                        </td>

                        <td className="px-4 py-3 min-w-[140px]">
                          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-1">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${
                                isOut
                                  ? 'bg-rose-500 w-0'
                                  : isLow
                                  ? 'bg-amber-500'
                                  : 'bg-emerald-500'
                              }`}
                              style={{ width: `${stockPercent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-slate-400 font-mono flex justify-between">
                            <span>{p.inStock} left</span>
                            <span>Max: {p.maxStock}</span>
                          </div>
                        </td>

                        <td className="px-3 py-3 text-center whitespace-nowrap font-mono font-bold">
                          {editingStockId === p.id ? (
                            <div className="flex items-center justify-center gap-1">
                              <input
                                type="number"
                                min={0}
                                max={p.maxStock}
                                value={tempStockValue}
                                onChange={(e) => setTempStockValue(parseInt(e.target.value) || 0)}
                                className="w-16 px-1.5 py-0.5 border border-sky-500 rounded text-center text-xs font-bold text-slate-900 bg-sky-50"
                              />
                              <button
                                onClick={() => handleSaveStock(p.id)}
                                className="px-2 py-0.5 bg-emerald-600 text-white rounded text-[11px] font-bold"
                              >
                                Save
                              </button>
                            </div>
                          ) : (
                            <span
                              onClick={() => handleStartEdit(p.id, p.inStock)}
                              className={`px-2.5 py-1 rounded-full text-xs cursor-pointer hover:ring-2 hover:ring-sky-400 transition ${
                                isOut
                                  ? 'bg-rose-100 text-rose-800'
                                  : isLow
                                  ? 'bg-amber-100 text-amber-900 font-extrabold animate-pulse'
                                  : 'bg-emerald-100 text-emerald-900'
                              }`}
                              title="Click to edit stock manually"
                            >
                              {p.inStock} units
                            </span>
                          )}
                        </td>

                        <td className="px-4 py-3 text-right whitespace-nowrap">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => restockProduct(p.id, 5)}
                              className="px-2 py-1 bg-sky-50 hover:bg-sky-100 text-sky-700 border border-sky-200 rounded font-bold text-[11px] transition cursor-pointer"
                              title="Add 5 units to warehouse stock"
                            >
                              +5 Units
                            </button>
                            <button
                              onClick={() => restockProduct(p.id, 15)}
                              className="px-2 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded font-bold text-[11px] transition cursor-pointer"
                              title="Add 15 units to warehouse stock"
                            >
                              +15 Units
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Live Inventory Activity & Audit Trail */}
          <div className="bg-slate-900 rounded-xl p-4 text-white border border-slate-800">
            <div className="flex items-center justify-between mb-3 border-b border-slate-800 pb-2">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Live Stock Transaction & Audit Stream
                </h4>
              </div>
              <span className="text-[10px] font-mono text-slate-400">
                {inventoryLogs.length} events logged
              </span>
            </div>

            {inventoryLogs.length > 0 ? (
              <div className="divide-y divide-slate-800/80 max-h-48 overflow-y-auto font-mono text-[11px]">
                {inventoryLogs.slice(0, 10).map((log) => (
                  <div key={log.id} className="py-1.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="text-slate-500">[{log.timestamp}]</span>
                      <span
                        className={`px-1.5 py-0.2 rounded text-[10px] font-bold uppercase ${
                          log.reason === 'purchase'
                            ? 'bg-rose-950 text-rose-300 border border-rose-800/50'
                            : log.reason === 'restock'
                            ? 'bg-emerald-950 text-emerald-300 border border-emerald-800/50'
                            : 'bg-amber-950 text-amber-300 border border-amber-800/50'
                        }`}
                      >
                        {log.reason}
                      </span>
                      <span className="text-slate-200 font-sans font-medium">{log.productName}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span
                        className={`font-bold ${
                          log.change > 0 ? 'text-emerald-400' : 'text-rose-400'
                        }`}
                      >
                        {log.change > 0 ? `+${log.change}` : log.change} units
                      </span>
                      <span className="text-slate-400">Remaining: {log.remainingStock}</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-3 text-center">
                Simulation active. Shopper purchases and restocking events will stream here in real time.
              </p>
            )}
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 flex items-center justify-between text-xs text-slate-600">
          <span>Synced with SuperMart POS & RFID Aisle Scanners</span>
          <button
            onClick={() => setIsInventoryModalOpen(false)}
            className="bg-slate-900 hover:bg-slate-800 text-white font-bold px-4 py-2 rounded-lg transition cursor-pointer"
          >
            Done Monitoring
          </button>
        </div>

      </div>
    </div>
  );
};
