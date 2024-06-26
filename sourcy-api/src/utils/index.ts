import Product from "../db/Product";
import ProductAttributes from "../db/ProductAttributes";
import ProductVariants from "../db/ProductVariants";

interface ProductFeatures {
  product: Product;
  features: string[];
}

interface RecommenderData {
  productFeatures: ProductFeatures[];
  allDocuments: string[][];
  idfValues: Map<string, number>;
}

function extractTextFeatures(
  product: Product,
  attributes: ProductAttributes[],
  variants: ProductVariants[]
): string {
  const productText = `title:${product.title} gpt_description:${product.gpt_description} stock_units:${product.stock_units} title_translated:${product.title_translated}`;

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
        `price:${variant.price} weight_per_unit_kg:${variant.weight_per_unit_kg} ` +
        `length_cm:${variant.length_cm} width_cm:${variant.width_cm} height_cm:${variant.height_cm} ` +
        `price_currency:${variant.price_currency} is_validated:${variant.is_validated} ` +
        `is_catalogued:${variant.is_catalogued}`
    )
    .join(" ");

  return `${productText} ${attributeText} ${variantText}`;
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/\W+/)
    .filter((word) => word.length > 0);
}

function preprocessProducts(
  products: Product[],
  attributes: ProductAttributes[],
  variants: ProductVariants[]
): ProductFeatures[] {
  return products.map((product) => ({
    product,
    features: tokenize(extractTextFeatures(product, attributes, variants)),
  }));
}

function calculateIDF(documents: string[][]): Map<string, number> {
  const idfValues = new Map<string, number>();
  const docCount = documents.length;

  const termDocCounts = new Map<string, number>();
  for (const doc of documents) {
    const uniqueTerms = new Set(doc);
    for (const term of uniqueTerms) {
      termDocCounts.set(term, (termDocCounts.get(term) || 0) + 1);
    }
  }

  for (const [term, count] of termDocCounts) {
    idfValues.set(term, Math.log(docCount / (1 + count)));
  }

  return idfValues;
}

function initializeRecommenderData(
  products: Product[],
  attributes: ProductAttributes[],
  variants: ProductVariants[]
): RecommenderData {
  const productFeatures = preprocessProducts(products, attributes, variants);
  const allDocuments = productFeatures.map((pf) => pf.features);
  const idfValues = calculateIDF(allDocuments);

  return { productFeatures, allDocuments, idfValues };
}

function calculateTFIDFVector(
  document: string[],
  idfValues: Map<string, number>
): Map<string, number> {
  const tfidf = new Map<string, number>();
  const termFrequency = new Map<string, number>();

  for (const term of document) {
    termFrequency.set(term, (termFrequency.get(term) || 0) + 1);
  }

  for (const [term, tf] of termFrequency) {
    const idf = idfValues.get(term) || 0;
    tfidf.set(term, (tf / document.length) * idf);
  }

  return tfidf;
}

function cosineSimilarity(
  vectorA: Map<string, number>,
  vectorB: Map<string, number>
): number {
  let dotProduct = 0;
  let magnitudeA = 0;
  let magnitudeB = 0;

  for (const [term, weightA] of vectorA) {
    const weightB = vectorB.get(term) || 0;
    dotProduct += weightA * weightB;
    magnitudeA += weightA * weightA;
  }

  for (const weightB of vectorB.values()) {
    magnitudeB += weightB * weightB;
  }

  return dotProduct / (Math.sqrt(magnitudeA) * Math.sqrt(magnitudeB));
}

function getRecommendations(
  searchProductId: number,
  recommenderData: RecommenderData,
  similarityThreshold: number = 0.9
): Product[] {
  const { productFeatures, idfValues } = recommenderData;

  const searchProductFeatures = productFeatures.find(
    (pf) => pf.product.product_id === searchProductId
  );

  if (!searchProductFeatures) {
    return [];
  }

  const searchVector = calculateTFIDFVector(
    searchProductFeatures.features,
    idfValues
  );

  const similarities = productFeatures
    .filter((pf) => pf.product.product_id !== searchProductId)
    .map((pf) => ({
      product: pf.product,
      similarity: cosineSimilarity(
        searchVector,
        calculateTFIDFVector(pf.features, idfValues)
      ),
    }))
    .filter((item) => item.similarity > similarityThreshold)
    .sort((a, b) => b.similarity - a.similarity);

  return similarities.map(
    ({ product }) =>
      ({
        product_id: product.product_id,
        title: product.title,
        title_translated: product.title_translated,
        gpt_description: product.gpt_description,
        image_urls: product.image_urls,
      } as Product)
  );
}

export { initializeRecommenderData, getRecommendations };
