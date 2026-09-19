
import React from 'react';

interface InventoryProps {
    items: string[];
}

const Inventory: React.FC<InventoryProps> = ({ items }) => {
    return (
        <div className="border-b-2 border-slate-700 pb-4">
            <h3 className="text-xl font-special text-slate-300 mb-3 text-center">Inventory</h3>
            <div className="flex flex-wrap gap-2 justify-center min-h-[3rem]">
                {items.length > 0 ? (
                    items.map((item, index) => (
                        <div key={index} className="bg-slate-900/70 text-green-400 font-mono text-sm py-1 px-3 rounded-full border border-green-700">
                           {item}
                        </div>
                    ))
                ) : (
                    <p className="text-slate-500 italic">Empty</p>
                )}
            </div>
        </div>
    );
};

export default Inventory;
