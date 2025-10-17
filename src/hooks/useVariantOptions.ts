// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable @typescript-eslint/no-shadow */
// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable camelcase */
import {
  ProductDetailInterface,
  VariantActiveState,
  VariantAvailableState,
  VariantOption,
  Variants
} from 'interfaces/ProductDetailInterface';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { currencyFormatter } from 'utils/currencyFormatter';

interface UseVariantOptionsProps {
  variant_stock_keys: ProductDetailInterface['variant_stock_keys'] | undefined;
  isOpen: boolean;
  allVariantOutOfStock: boolean;
  option_sequence: Array<Variants>;
  variant_id?: string;
  lowest_price: number;
  highest_price: number;
}

interface VariantOptionDataProps {
  options: Array<VariantOption>;
  variant: Variants;
}

interface StockAndPriceInfo {
  price: string;
  stock: string | number;
  isStockEmpty: boolean;
  isSoldOut: boolean;
  stocksKey: string | null;
  stocksValue: ProductDetailInterface['variant_stock_keys']['stocks'][string] | null;
}

// Utility functions
const createFlattenedIds = (options: Array<VariantOption>, variant: string) => {
  const variantIds = options.map((option) => ({ [variant]: option.id }));
  return variantIds.reduce((acc: { [key: string]: Array<string> }, obj) => {
    Object.entries(obj).forEach(([objKey, value]) => {
      acc[objKey] = acc[objKey] ? [...acc[objKey], value] : [value];
    });
    return acc;
  }, {});
};

const filterNoStockVariants = (
  flattenedIds: { [key: string]: Array<string> },
  optionNoStocks: ProductDetailInterface['variant_stock_keys']['option_no_stocks']
) => {
  const result = { ...flattenedIds };
  Object.entries(result).forEach(([key, value]) => {
    if (key in optionNoStocks) {
      result[key] = value.filter((item) => !optionNoStocks[key].includes(item));
    }
  });
  return result;
};

const processVariantAvailable = (
  available: VariantAvailableState,
  variant: string,
  optionKey: string
) => {
  return Object.values(available)
    .map((prop) => prop[`${variant}${optionKey}`])
    .filter((arr): arr is Array<string> => Array.isArray(arr) && arr.length > 0);
};

const calculateCommonAvailable = (variantAvailable: Array<Array<string>>) => {
  if (!variantAvailable.length) return [];

  return variantAvailable.reduce((acc: Array<string>, curr: Array<string>) => {
    if (!Array.isArray(acc)) return curr;
    return acc.filter((item) => curr.includes(item));
  }, variantAvailable[0] || []);
};

const calculateUniqueVariant = (commonAvailable: Array<string>) => {
  const hasDuplicates = new Set(commonAvailable).size !== commonAvailable.length;
  return hasDuplicates
    ? commonAvailable.filter((value, index, self) => self.indexOf(value) !== index)
    : commonAvailable;
};

const findVariantStockEntry = (
  variantId: string,
  stocks: ProductDetailInterface['variant_stock_keys']['stocks']
) => {
  return Object.entries(stocks || {}).find(([, value]) => value.variant_id === variantId);
};

const createDefaultSelectedFromStockKey = (
  stockKey: string,
  option_sequence: Array<Variants>
): VariantActiveState => {
  const parts = stockKey.split('_');

  return option_sequence.reduce((acc, key, index) => {
    if (parts[index]) {
      acc[key] = parts[index];
    }
    return acc;
  }, {} as VariantActiveState);
};

const constructStocksKey = (
  active: VariantActiveState,
  option_sequence: Array<Variants>
): string | null => {
  const activeKeys = Object.keys(active);
  const isComplete = activeKeys.length === option_sequence?.length;
  const isTheSameOrder = activeKeys.every((key, index) => key === option_sequence?.[index]);

  if (isComplete) {
    if (isTheSameOrder) {
      return option_sequence?.map((key) => active[key]).join('_');
    }

    const reorderedActiveKeys = option_sequence.filter((key) => activeKeys.includes(key));
    const reorderedIsComplete = reorderedActiveKeys.join() === option_sequence.join();

    if (reorderedIsComplete) {
      return option_sequence?.map((key) => active[key]).join('_');
    }
  }

  return null;
};

const calculateStockAndPrice = (
  active: VariantActiveState,
  option_sequence: Array<Variants>,
  variant_stock_keys: ProductDetailInterface['variant_stock_keys'] | undefined,
  allVariantOutOfStock: boolean,
  lowest_price: number | undefined,
  highest_price: number | undefined
): StockAndPriceInfo => {
  const stocksKey = constructStocksKey(active, option_sequence);
  const stocksValue =
    stocksKey && variant_stock_keys?.stocks ? variant_stock_keys.stocks[stocksKey] : null;

  const price = stocksValue?.price
    ? currencyFormatter(stocksValue.price)
    : Number(lowest_price) === Number(highest_price)
      ? currencyFormatter(Number(lowest_price))
      : `${currencyFormatter(Number(lowest_price))}-${currencyFormatter(Number(highest_price))}`;

  const stock = stocksValue?.qty || '-';
  const isStockEmpty = stock === 0 || stock === '-';
  const isSoldOut = allVariantOutOfStock || (isStockEmpty && !!stocksKey);

  return {
    price,
    stock,
    isStockEmpty,
    isSoldOut,
    stocksKey,
    stocksValue
  };
};

const useVariantOptions = ({
  variant_stock_keys,
  isOpen,
  allVariantOutOfStock,
  option_sequence,
  variant_id,
  highest_price,
  lowest_price
  // eslint-disable-next-line sonarjs/cognitive-complexity
}: UseVariantOptionsProps) => {
  const { t } = useTranslation('productDetail');
  const [active, setActive] = useState<VariantActiveState>({});
  const [available, setAvailable] = useState<VariantAvailableState>({});

  const previousActiveRef = useRef<VariantActiveState>({});
  const previousStockKeysRef = useRef(variant_stock_keys);
  const previousVariantIdRef = useRef(variant_id);

  const OPTION_KEY = isOpen ? '_has_stock' : '_available';

  // Core variant option data processing
  const variantOptionData = useCallback(
    ({ options, variant }: VariantOptionDataProps) => {
      if (!options?.length) return [];

      // Step 1: Create flattened variant IDs
      const flattenedVariantIds = createFlattenedIds(options, variant);

      // Step 2: Filter out no-stock variants
      const processedIds = variant_stock_keys?.option_no_stocks
        ? filterNoStockVariants(flattenedVariantIds, variant_stock_keys.option_no_stocks)
        : flattenedVariantIds;

      const variantExceptNoStock = Object.values(processedIds).flat();

      // Handle empty available state
      if (Object.keys(available).length === 0) {
        return options.map((option) => ({
          ...option,
          disabled: isOpen ? !variantExceptNoStock.includes(option.id) : false
        }));
      }

      // Process available variants
      const variantAvailable = processVariantAvailable(available, variant, OPTION_KEY);
      if (!variantAvailable.length) {
        return options.map((option) => ({ ...option, disabled: false }));
      }

      // Calculate common and unique variants
      const commonAvailable = calculateCommonAvailable(variantAvailable);
      if (!Array.isArray(commonAvailable)) {
        return options.map((option) => ({ ...option, disabled: false }));
      }

      const uniqueVariant = calculateUniqueVariant(commonAvailable);
      const cartVariant = variantExceptNoStock.filter(
        (elm) => Array.isArray(uniqueVariant) && uniqueVariant.includes(elm)
      );

      // Map final options with disability status
      return options.map((option) => ({
        ...option,
        disabled: isOpen ? !cartVariant.includes(option.id) : !uniqueVariant.includes(option.id)
      }));
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [OPTION_KEY, available, isOpen, allVariantOutOfStock, variant_stock_keys?.option_no_stocks]
  );

  const constructLabel = useCallback((variant: Variants) => t(variant), [t]);

  // Calculate stock and price information
  const stockAndPrice = useMemo(() => {
    return calculateStockAndPrice(
      active,
      option_sequence,
      variant_stock_keys,
      allVariantOutOfStock,
      lowest_price,
      highest_price
    );
  }, [
    active,
    option_sequence,
    variant_stock_keys,
    allVariantOutOfStock,
    lowest_price,
    highest_price
  ]);

  // Handle default selection
  const handleVariantSelection = useCallback(() => {
    // If we have a variant_id, try to find its stock entry
    if (variant_id && variant_stock_keys?.stocks) {
      const stockEntry = findVariantStockEntry(variant_id, variant_stock_keys.stocks);

      if (stockEntry) {
        const [stockKey] = stockEntry;
        const defaultSelected = createDefaultSelectedFromStockKey(stockKey, option_sequence);
        setActive(defaultSelected);
        return;
      }
    }

    // Fallback to default selection if no variant_id or no matching stock entry
    if (variant_stock_keys?.default_selected) {
      setActive(variant_stock_keys.default_selected);
    }
  }, [variant_id, variant_stock_keys, option_sequence]);

  // Handle initial selection and updates
  useEffect(() => {
    const shouldUpdateSelection =
      variant_id !== previousVariantIdRef.current ||
      variant_stock_keys !== previousStockKeysRef.current;

    if (shouldUpdateSelection) {
      previousVariantIdRef.current = variant_id;
      previousStockKeysRef.current = variant_stock_keys;
      handleVariantSelection();
    }
  }, [variant_id, variant_stock_keys, handleVariantSelection]);

  // Update available options
  const updateAvailableOptions = useCallback(() => {
    if (Object.keys(active).length === 0) {
      return {};
    }

    const newAvailable: VariantAvailableState = {};

    option_sequence?.forEach((sequence) => {
      const key = sequence as Variants;
      const matchIds = variant_stock_keys?.options?.[key]?.find(
        (option) => option.id === active[key]
      );

      if (matchIds) {
        const hasStockKeys = Object.entries(matchIds)
          .filter(([key]) => key.endsWith(OPTION_KEY))
          .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});

        const currentKeyAvailable = variant_stock_keys?.options?.[key]?.reduce(
          (acc, option) => ({
            ...acc,
            [`${key + OPTION_KEY}`]: [...(acc[`${key + OPTION_KEY}`] || []), option.id]
          }),
          {} as Record<string, Array<string>>
        );

        newAvailable[key] =
          Object.keys(active).length === 1
            ? { ...hasStockKeys, ...currentKeyAvailable }
            : hasStockKeys;
      }
    });

    return newAvailable;
  }, [OPTION_KEY, active, option_sequence, variant_stock_keys?.options]);

  useEffect(() => {
    if (JSON.stringify(previousActiveRef.current) === JSON.stringify(active)) {
      return;
    }

    previousActiveRef.current = active;

    if (Object.keys(active).length === 0) {
      setAvailable({});
      return;
    }

    const newAvailable = updateAvailableOptions();

    if (JSON.stringify(newAvailable) !== JSON.stringify(available)) {
      setAvailable(newAvailable);
    }
  }, [active, available, updateAvailableOptions]);

  return {
    variantOptionData,
    label: constructLabel,
    active,
    available,
    setActive,
    setAvailable,
    ...stockAndPrice
  };
};

export default useVariantOptions;
