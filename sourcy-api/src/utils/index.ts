import Product from "../db/Product";
import ProductAttributes from "../db/ProductAttributes";
import ProductVariants from "../db/ProductVariants";

// Function to extract text features from product, attributes, and variants
function extractTextFeatures(
  product: Product,
  attributes: ProductAttributes[],
  variants: ProductVariants[]
): string {
  const productText = `title:${product.title} gpt_category_suggestion:${product.gpt_category_suggestion} gpt_description:${product.gpt_description} is_catalogued:${product.is_catalogued} is_validated:${product.is_validated} repurchase_rate:${product.repurchase_rate} stock_count:${product.stock_count} stock_units:${product.stock_units} keyword:${product.keyword} title_translated:${product.title_translated}`;

  const attributeText = attributes
    .filter((attr) => attr.product_id === product.product_id)
    .map(
      (attr) => `${attr.product_attribute_key}:${attr.product_attribute_value}`
    )
    .join(" ");

  const variantText = variants
    .filter((variant) => variant.product_id === product.product_id)
    .map(
      (variant) =>
        `variant_key:${variant.product_variant_key} price:${variant.price} stock_count:${variant.stock_count} weight_per_unit_kg:${variant.weight_per_unit_kg} length_cm:${variant.length_cm} width_cm:${variant.width_cm} height_cm:${variant.height_cm} price_currency:${variant.price_currency} stock_units:${variant.stock_units} is_validated:${variant.is_validated} is_catalogued:${variant.is_catalogued}`
    )
    .join(" ");

  return `${productText} ${attributeText} ${variantText}`;
}

// Tokenize the text into words
function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 0);
}

// Calculate term frequency (TF)
function termFrequency(term: string, document: string[]): number {
  const termCount = document.filter((word) => word === term).length;
  return termCount / document.length;
}

// Calculate inverse document frequency (IDF)
function inverseDocumentFrequency(term: string, documents: string[][]): number {
  const docCount = documents.length;
  const termInDocsCount = documents.filter((doc) => doc.includes(term)).length;
  return Math.log(docCount / (1 + termInDocsCount));
}

// Calculate TF-IDF vector for a document
function tfIdfVector(document: string[], documents: string[][]): number[] {
  const uniqueTerms = Array.from(new Set(document));
  return uniqueTerms.map(
    (term) =>
      termFrequency(term, document) * inverseDocumentFrequency(term, documents)
  );
}

// Calculate cosine similarity between two vectors
function cosineSimilarity(vectorA: number[], vectorB: number[]): number {
  const dotProduct = vectorA.reduce((sum, val, i) => sum + val * vectorB[i], 0);
  const magnitudeA = Math.sqrt(
    vectorA.reduce((sum, val) => sum + val * val, 0)
  );
  const magnitudeB = Math.sqrt(
    vectorB.reduce((sum, val) => sum + val * val, 0)
  );
  return dotProduct / (magnitudeA * magnitudeB);
}

// Function to get recommendations
function getRecommendations(
  searchProduct: Product | undefined,
  products: Product[],
  attributes: ProductAttributes[],
  variants: ProductVariants[],
  topN: number = 5
): Product[] {
  if (!searchProduct) {
    return [];
  }

  const allDocuments = products.map((product) =>
    tokenize(extractTextFeatures(product, attributes, variants))
  );
  const searchDocument = tokenize(
    extractTextFeatures(searchProduct, attributes, variants)
  );

  const allVectors = allDocuments.map((doc) => tfIdfVector(doc, allDocuments));
  const searchVector = tfIdfVector(searchDocument, allDocuments);

  const similarities = allVectors.map((vector) =>
    cosineSimilarity(vector, searchVector)
  );

  // Filter out the search product
  const filteredSimilarities = similarities
    .map((score, index) => ({ score, index }))
    .filter(
      ({ index }) => products[index].product_id !== searchProduct.product_id
    )
    .sort((a, b) => b.score - a.score)
    .slice(0, topN);

  // return and extract certain fields
  return filteredSimilarities
    .map(({ index }) => products[index])
    .map((product) => {
      const {
        product_id,
        title,
        title_translated,
        gpt_description,
        image_urls,
      } = product;
      return {
        product_id,
        title,
        title_translated,
        gpt_description,
        image_urls,
      } as Product;
    });
}

export { getRecommendations };
