import { getProducts, searchProducts } from "@/lib/api/products";

jest.setTimeout(10_000);

describe("product search and filters", () => {
  it("searches products by name fields", async () => {
    const result = await searchProducts("serum");
    expect(result.total).toBeGreaterThan(0);
    expect(
      result.items.every((product) => {
        const haystack = [
          product.name,
          product.brand,
          product.category,
          product.description,
          ...product.concerns,
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes("serum");
      })
    ).toBe(true);
  });

  it("returns an empty list for unknown queries", async () => {
    const result = await searchProducts("nonexistentproductxyz");
    expect(result.items).toEqual([]);
    expect(result.total).toBe(0);
  });

  it("treats an empty query as an unfiltered catalog request", async () => {
    const empty = await searchProducts("");
    const all = await getProducts({ pageSize: 50 });
    expect(empty.total).toBe(all.total);
  });

  it("filters by category", async () => {
    const result = await getProducts({ category: "serum", pageSize: 20 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((product) => product.category === "serum")).toBe(
      true
    );
  });

  it("filters by brand", async () => {
    const result = await getProducts({
      brand: "Lumina Lab",
      pageSize: 20,
    });
    expect(result.items.length).toBeGreaterThan(0);
    expect(
      result.items.every((product) => product.brand === "Lumina Lab")
    ).toBe(true);
  });

  it("filters by minimum rating", async () => {
    const result = await getProducts({ minRating: 4.5, pageSize: 50 });
    expect(result.items.length).toBeGreaterThan(0);
    expect(result.items.every((product) => product.rating >= 4.5)).toBe(true);
  });

  it("sorts by price low to high", async () => {
    const result = await getProducts({ sort: "price-low", pageSize: 20 });
    const prices = result.items.map((product) => product.price);
    const sorted = [...prices].sort((a, b) => a - b);
    expect(prices).toEqual(sorted);
  });

  it("sorts by price high to low", async () => {
    const result = await getProducts({ sort: "price-high", pageSize: 20 });
    const prices = result.items.map((product) => product.price);
    const sorted = [...prices].sort((a, b) => b - a);
    expect(prices).toEqual(sorted);
  });

  it("sorts by rating", async () => {
    const result = await getProducts({ sort: "rating", pageSize: 20 });
    const ratings = result.items.map((product) => product.rating);
    const sorted = [...ratings].sort((a, b) => b - a);
    expect(ratings).toEqual(sorted);
  });

  it("sorts newest arrivals ahead of older products", async () => {
    const result = await getProducts({ sort: "newest", pageSize: 50 });
    const flags = result.items.map((product) => Number(product.isNewArrival));
    const sorted = [...flags].sort((a, b) => b - a);
    expect(flags).toEqual(sorted);
  });
});
