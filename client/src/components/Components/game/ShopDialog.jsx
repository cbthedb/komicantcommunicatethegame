import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, ShoppingCart, DollarSign, Package } from 'lucide-react';
import { getShopItems, ITEM_CATEGORIES } from './ItemSystem';

const CATEGORY_ICONS = {
  [ITEM_CATEGORIES.GIFT]: '🎁',
  [ITEM_CATEGORIES.CONSUMABLE]: '☕',
  [ITEM_CATEGORIES.BOOK]: '📚',
  [ITEM_CATEGORIES.ACCESSORY]: '👜',
  [ITEM_CATEGORIES.COLLECTIBLE]: '⭐'
};

export default function ShopDialog({ shop, money, inventory, onBuy, onClose }) {
  const [selectedItem, setSelectedItem] = useState(null);
  const items = getShopItems(shop.id);

  const handleBuy = (item) => {
    if (money >= item.price) {
      onBuy(item.id);
      setSelectedItem(null);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto border border-slate-700"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-semibold text-purple-100">{shop.name}</h2>
            <p className="text-sm text-purple-300/70">{shop.description}</p>
          </div>
          <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6 p-3 bg-slate-900/50 rounded-lg border border-slate-700">
          <DollarSign className="w-5 h-5 text-green-400" />
          <span className="text-purple-100 font-medium">Your Money: ${money}</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {items.map((item) => {
            const owned = inventory?.[item.id] || 0;
            const canAfford = money >= item.price;

            return (
              <Card
                key={item.id}
                className={`p-4 bg-slate-700/50 border transition-all cursor-pointer ${
                  selectedItem?.id === item.id
                    ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                    : 'border-slate-600 hover:border-purple-500/50'
                }`}
                onClick={() => setSelectedItem(item)}
              >
                <div className="flex items-start gap-3">
                  <div className="text-3xl">{CATEGORY_ICONS[item.category]}</div>
                  <div className="flex-1">
                    <h3 className="font-medium text-purple-100 mb-1">{item.name}</h3>
                    <p className="text-xs text-slate-400 mb-2">{item.description}</p>
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-medium ${canAfford ? 'text-green-400' : 'text-red-400'}`}>
                        ${item.price}
                      </span>
                      {owned > 0 && (
                        <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                          Owned: {owned}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>

        <AnimatePresence>
          {selectedItem && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className="mt-6 p-4 bg-slate-900/70 rounded-lg border border-slate-600"
            >
              <h3 className="text-lg font-semibold text-purple-100 mb-2">{selectedItem.name}</h3>
              <p className="text-sm text-slate-300 mb-3">{selectedItem.description}</p>

              {selectedItem.effects && (
                <div className="mb-4">
                  <p className="text-xs text-purple-400 mb-2">Effects:</p>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedItem.effects).map(([stat, value]) => (
                      <span
                        key={stat}
                        className={`text-xs px-2 py-1 rounded-full ${
                          value > 0
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {value > 0 ? '+' : ''}{value} {stat}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <Button
                  onClick={() => handleBuy(selectedItem)}
                  disabled={money < selectedItem.price}
                  className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Buy for ${selectedItem.price}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedItem(null)}
                  className="border-slate-600 text-purple-300"
                >
                  Cancel
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
}