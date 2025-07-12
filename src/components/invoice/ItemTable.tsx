import React, { ReactElement } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';

type Item = {
  description: string;
  quantity: number;
  unit_price: number;
  tax_rate: number;
};

type ItemTableProps = {
  items: Item[];
  updateItem: (idx: number, field: string, value: string) => void;
  removeItem: (idx: number) => void;
  addItem: () => void;
  moveItem: (fromIdx: number, toIdx: number) => void;
  currencySymbol: string;
  grandTotal: number;
};

const ItemTable: React.FC<ItemTableProps> = ({
  items,
  updateItem,
  removeItem,
  addItem,
  moveItem,
  currencySymbol,
  grandTotal,
}) => {
  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;
    if (result.source.index !== result.destination.index) {
      moveItem(result.source.index, result.destination.index);
    }
  };

  return (
    <div className="mt-10">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-lg font-medium">Item Table</h2>
      </div>
      <div className="flex gap-2 mb-4">
        <button
          type="button"
          onClick={addItem}
          className="border border-blue-500 text-blue-600 px-4 py-2 text-sm font-medium bg-transparent hover:bg-blue-50 transition"
        >
          + Add New Row
        </button>
        <button
          type="button"
          className="border border-blue-500 text-blue-600 px-4 py-2 text-sm font-medium bg-transparent hover:bg-blue-50 transition"
          onClick={e => { e.preventDefault(); alert('Bulk add not implemented yet.'); }}
        >
          + Add Items in Bulk
        </button>
      </div>
      <div className="overflow-x-auto">
        <DragDropContext onDragEnd={onDragEnd}>
          <table className="min-w-[900px] w-full border-t border-b border-gray-200 bg-transparent">
            <thead>
              <tr className="text-xs font-semibold text-gray-700 uppercase tracking-wider">
                <th className="px-4 py-2 text-left w-1/2">Item Details</th>
                <th className="px-4 py-2 text-right w-1/12">Quantity</th>
                <th className="px-4 py-2 text-right w-1/12">Price</th>
                <th className="px-4 py-2 text-right w-1/12">Tax %</th>
                <th className="px-4 py-2 text-right w-1/12">Tax Amt</th>
                <th className="px-4 py-2 text-right w-1/12">Total</th>
                <th className="px-2 py-2 w-8"></th>
              </tr>
            </thead>
            <Droppable droppableId="item-table">
              {(provided) => (
                <tbody ref={provided.innerRef} {...provided.droppableProps}>
                  {items.length === 0 && (
                    <tr>
                      <td colSpan={7} className="text-sm text-gray-500 px-2 py-4 text-center">
                        No items yet.
                      </td>
                    </tr>
                  )}
                  {items.map((item, idx) => {
                    const taxAmount = item.quantity * item.unit_price * item.tax_rate / 100;
                    const rowTotal = (item.quantity * item.unit_price) + taxAmount;
                    return (
                      <Draggable key={idx} draggableId={String(idx)} index={idx}>
                        {(provided, snapshot) => (
                          <tr
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className={`group border-t border-gray-100 hover:bg-gray-50 ${snapshot.isDragging ? 'bg-blue-50' : ''}`}
                          >
                            <td className="px-4 py-3 align-top">
                              <input
                                placeholder="Description"
                                className="w-full bg-transparent outline-none rounded-none px-2 py-2"
                                value={item.description}
                                onChange={(e) => updateItem(idx, 'description', e.target.value)}
                              />
                            </td>
                            <td className="px-4 py-3 text-right align-top">
                              <input
                                type="number"
                                placeholder="Qty"
                                className="w-16 bg-transparent text-right outline-none rounded-none px-2 py-2"
                                value={item.quantity}
                                onChange={(e) => updateItem(idx, 'quantity', e.target.value)}
                                min={1}
                              />
                            </td>
                            <td className="px-4 py-3 text-right align-top">
                              <div className="relative flex items-center">
                                <span className="absolute left-0 pl-1 text-gray-400 text-sm">{currencySymbol}</span>
                                <input
                                  type="number"
                                  placeholder="Price"
                                  step="0.01"
                                  className="pl-5 w-20 bg-transparent text-right outline-none rounded-none px-2 py-2"
                                  value={item.unit_price}
                                  onChange={(e) => updateItem(idx, 'unit_price', e.target.value)}
                                  min={0}
                                />
                              </div>
                            </td>
                            <td className="px-4 py-3 text-right align-top">
                              <input
                                type="number"
                                placeholder="Tax"
                                step="0.01"
                                className="w-16 bg-transparent text-right outline-none rounded-none px-2 py-2"
                                value={item.tax_rate}
                                onChange={(e) => updateItem(idx, 'tax_rate', e.target.value)}
                                min={0}
                              />
                            </td>
                            <td className="px-4 py-3 text-right align-top">
                              <span className="text-gray-700">{currencySymbol}{taxAmount.toFixed(2)}</span>
                            </td>
                            <td className="px-4 py-3 text-right align-top font-semibold">
                              {currencySymbol}{rowTotal.toFixed(2)}
                            </td>
                            <td className="px-2 py-3 text-center align-top">
                              <div className="flex items-center gap-1 justify-center">
                                <span
                                  className="inline-block cursor-move text-gray-300 group-hover:text-gray-400"
                                  {...provided.dragHandleProps}
                                >
                                  <svg width="16" height="16" fill="none" viewBox="0 0 16 16">
                                    <circle cx="4" cy="4" r="1" fill="currentColor"/>
                                    <circle cx="4" cy="8" r="1" fill="currentColor"/>
                                    <circle cx="4" cy="12" r="1" fill="currentColor"/>
                                    <circle cx="8" cy="4" r="1" fill="currentColor"/>
                                    <circle cx="8" cy="8" r="1" fill="currentColor"/>
                                    <circle cx="8" cy="12" r="1" fill="currentColor"/>
                                  </svg>
                                </span>
                                <button
                                  type="button"
                                  onClick={() => removeItem(idx)}
                                  className="text-red-500 hover:text-red-700 ml-1"
                                  title="Remove item"
                                >
                                  &times;
                                </button>
                              </div>
                            </td>
                          </tr>
                        )}
                      </Draggable>
                    );
                  })}
                  {provided.placeholder}
                </tbody>
              )}
            </Droppable>
          </table>
        </DragDropContext>
      </div>
      <div className="flex justify-end items-center mt-2 mb-4 pr-2">
        <span className="text-lg font-semibold mr-4">Total ({currencySymbol})</span>
        <span className="text-2xl font-bold">{grandTotal.toFixed(2)}</span>
      </div>
    </div>
  );
};

export default ItemTable; 