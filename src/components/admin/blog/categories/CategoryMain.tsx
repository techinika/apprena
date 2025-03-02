"use client";
import React from "react";
import { CategoriesList } from "./CategoriesList";
import NewCategory from "./NewCategory";
import PageHeader from "@/components/admin/main/PageHeader";

function CategoryMain() {
  return (
    <div className="space-y-4 p-8 pt-6">
      <PageHeader
        title="Categories"
        newItem={false}
        onExport={() => null}
        onPublish={() => null}
        saveDraft={() => null}
      />
      <div className="flex items-start justify-between gap-4">
        <div className="w-[50%]">
          <CategoriesList />
        </div>
        <div className="w-[50%] p-5 rounded border border-gray-100">
          <NewCategory />
        </div>
      </div>
    </div>
  );
}

export default CategoryMain;
