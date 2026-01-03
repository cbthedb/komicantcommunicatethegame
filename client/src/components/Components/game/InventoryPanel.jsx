import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Package, Gift, Zap } from 'lucide-react';
import { getItemById, ITEM_CATEGORIES } from './ItemSystem';
import FriendSelector from './FriendSelector';

const CATEGORY_ICONS = {
  [ITEM_CATEGORIES.GIFT]: '🎁',
  [ITEM_CATEGORIES.CONSUMABLE]: '☕',
  [ITEM_CATEGORIES.BOOK]: '📚',
  [ITEM_CATEGORIES.ACCESSORY]: '👜',
  [ITEM_CATEGORIES.COLLECTIBLE]: '⭐'
};

export default function InventoryPanel({ 
  inventory, 
  onUse, 
  onGive, 
  onClose,
  availableNpcs,
  relationships,
  mode = 'view',
  targetNpc = null
}) {
  const [selectedItem, setSelectedItem] = useState(null);
  const [showGiftSelector, setShowGiftSelector] = useState(false);

  const inventoryItems = Object.entries(inventory || {})
    .map(([itemId, quantity]) => ({ item: getItemById(itemId), quantity }))
    .filter(({ item }) => item);

  const handleUse = (itemId) => {
    const item = getItemById(itemId);
    if (item.category === ITEM_CATEGORIES.CONSUMABLE || item.category === ITEM_CATEGORIES.BOOK) {
      onUse(itemId);
      setSelectedItem(null);
    }
  };

  const handleGiftSelect = () => {
    if (targetNpc) {
      handleGiveToNpc(targetNpc);
    } else {
      setShowGiftSelector(true);
    }
  };

  const handleGiveToNpc = (npcId) => {
    if (selectedItem) {
      onGive(selectedItem.item.id, npcId);
      setShowGiftSelector(false);
      setSelectedItem(null);
      if (mode === 'pick_gift') onClose();
    }
  };

  return (
    <>
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
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Package className="w-6 h-6 text-purple-400" />
              <h2 className="text-2xl font-semibold text-purple-100">Inventory</h2>
            </div>
            <button onClick={onClose} className="text-purple-400 hover:text-purple-300">
              <X className="w-6 h-6" />
            </button>
          </div>

          {inventoryItems.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">Your inventory is empty</p>
              <p className="text-sm text-slate-500 mt-2">Visit shops to buy items!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
                {inventoryItems.map(({ item, quantity }) => (
                  <Card
                    key={item.id}
                    className={`p-3 bg-slate-700/50 border cursor-pointer transition-all ${
                      selectedItem?.item.id === item.id
                        ? 'border-purple-500 shadow-lg shadow-purple-500/20'
                        : 'border-slate-600 hover:border-purple-500/50'
                    }`}
                    onClick={() => setSelectedItem({ item, quantity })}
                  >
                    <div className="text-center">
                      <div className="text-3xl mb-2">{CATEGORY_ICONS[item.category]}</div>
                      <h3 className="text-sm font-medium text-purple-100 mb-1">{item.name}</h3>
                      <span className="text-xs text-purple-400 bg-purple-500/20 px-2 py-0.5 rounded-full">
                        x{quantity}
                      </span>
                    </div>
                  </Card>
                ))}
              </div>

              <AnimatePresence>
                {selectedItem && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 20 }}
                    className="p-4 bg-slate-900/70 rounded-lg border border-slate-600"
                  >
                    <div className="flex items-start gap-3 mb-4">
                      <div className="text-4xl">{CATEGORY_ICONS[selectedItem.item.category]}</div>
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-purple-100 mb-1">
                          {selectedItem.item.name}
                        </h3>
                        <p className="text-sm text-slate-300 mb-2">{selectedItem.item.description}</p>
                        <span className="text-xs text-purple-400">Quantity: {selectedItem.quantity}</span>
                      </div>
                    </div>

                    {selectedItem.item.effects && (
                      <div className="mb-4">
                        <p className="text-xs text-purple-400 mb-2">Effects:</p>
                        <div className="flex flex-wrap gap-2">
                          {Object.entries(selectedItem.item.effects).map(([stat, value]) => (
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
                      {selectedItem.item.category === ITEM_CATEGORIES.GIFT && (
                        <Button
                          onClick={handleGiftSelect}
                          className="flex-1 bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                        >
                          <Gift className="w-4 h-4 mr-2" />
                          Give as Gift
                        </Button>
                      )}

                      {(selectedItem.item.category === ITEM_CATEGORIES.CONSUMABLE || 
                        selectedItem.item.category === ITEM_CATEGORIES.BOOK) && (
                        <Button
                          onClick={() => handleUse(selectedItem.item.id)}
                          className="flex-1 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700"
                        >
                          <Zap className="w-4 h-4 mr-2" />
                          Use
                        </Button>
                      )}

                      <Button
                        variant="outline"
                        onClick={() => setSelectedItem(null)}
                        className="border-slate-600 text-purple-300"
                      >
                        Close
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </>
          )}
        </motion.div>
      </motion.div>

      <AnimatePresence>
        {showGiftSelector && (
          <FriendSelector
            availableNpcs={availableNpcs}
            relationships={relationships}
            onSelect={handleGiveToNpc}
            onClose={() => setShowGiftSelector(false)}
            title="Give gift to..."
            minRelationship={0}
          />
        )}
      </AnimatePresence>
    </>
  );
}