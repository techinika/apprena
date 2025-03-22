"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";

interface Item {
  id: string;
  label: string;
}

interface TransferListProps {
  availableItems: Item[];
  selectedItems: Item[];
  setAvailableItems: (items: Item[]) => void;
  setSelectedItems: (items: Item[]) => void;
}

export function TransferList({
  availableItems,
  selectedItems,
  setAvailableItems,
  setSelectedItems,
}: TransferListProps) {
  const [selectedAvailable, setSelectedAvailable] = useState<string[]>([]);
  const [selectedChosen, setSelectedChosen] = useState<string[]>([]);

  const moveToSelected = () => {
    const movingItems = availableItems.filter((item) =>
      selectedAvailable.includes(item.id)
    );
    setAvailableItems(availableItems.filter((item) => !selectedAvailable.includes(item.id)));
    setSelectedItems([...selectedItems, ...movingItems]);
    setSelectedAvailable([]);
  };

  const moveToAvailable = () => {
    const movingItems = selectedItems.filter((item) =>
      selectedChosen.includes(item.id)
    );
    setSelectedItems(selectedItems.filter((item) => !selectedChosen.includes(item.id)));
    setAvailableItems([...availableItems, ...movingItems]);
    setSelectedChosen([]);
  };

  return (
    <div className="flex gap-4">
      {/* Available Items */}
      <Card className="w-64 p-4">
        <h3 className="text-lg font-semibold">Available Items</h3>
        <div className="space-y-2">
          {availableItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedAvailable.includes(item.id)}
                onCheckedChange={() =>
                  setSelectedAvailable((prev) =>
                    prev.includes(item.id)
                      ? prev.filter((id) => id !== item.id)
                      : [...prev, item.id]
                  )
                }
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>

      {/* Action Buttons */}
      <div className="flex flex-col justify-center gap-2">
        <Button onClick={moveToSelected} disabled={selectedAvailable.length === 0}>
          →
        </Button>
        <Button onClick={moveToAvailable} disabled={selectedChosen.length === 0}>
          ←
        </Button>
      </div>

      {/* Selected Items */}
      <Card className="w-64 p-4">
        <h3 className="text-lg font-semibold">Selected Items</h3>
        <div className="space-y-2">
          {selectedItems.map((item) => (
            <div key={item.id} className="flex items-center gap-2">
              <Checkbox
                checked={selectedChosen.includes(item.id)}
                onCheckedChange={() =>
                  setSelectedChosen((prev) =>
                    prev.includes(item.id)
                      ? prev.filter((id) => id !== item.id)
                      : [...prev, item.id]
                  )
                }
              />
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
