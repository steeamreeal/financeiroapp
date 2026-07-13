"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Category } from "@/lib/types";

const ALL_VALUE = "all";

export function CategoryFilter({
  categories,
  value,
}: {
  categories: Category[];
  value: string;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function handleChange(newValue: string | null) {
    if (!newValue) return;
    const params = new URLSearchParams(searchParams.toString());
    if (newValue === ALL_VALUE) {
      params.delete("categoryId");
    } else {
      params.set("categoryId", newValue);
    }
    router.push(`${pathname}?${params.toString()}`);
  }

  return (
    <Select value={value || ALL_VALUE} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Categoria" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={ALL_VALUE}>Todas as categorias</SelectItem>
        {categories.map((category) => (
          <SelectItem key={category.id} value={category.id}>
            {category.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
