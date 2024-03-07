import React, { FC, useEffect, useState } from "react";
import { useField } from "payload/components/forms";
import {
  Checkbox,
  CheckboxGroup,
  FormControl,
  FormHelperText,
  FormLabel,
  Heading,
  Stack,
  Wrap,
} from "@chakra-ui/react";
import type { Product } from "payload/generated-types";

type Props = {
  label?: string;
  path: string;
  required?: boolean;
  admin?: {
    description?: string;
  };
  products?: Product[];
  onChange?: Function;
  value?: string[] | Product[];
  useObjects?: boolean;
};

type AllProducts = {
  [key: string]: Array<{ product: string; id: string | number }>;
};

export const ProductsField: FC<Props> = ({
  label,
  path,
  required,
  admin: { description } = {},
  products,
  onChange,
  value,
  useObjects = false,
}) => {
  const { value: current, setValue: setCurrent } = useField<any[]>({ path });
  const [allProducts, setAllProducts] = useState<AllProducts>({});
  const [index, setIndex] = useState<Map<string | number, Product>>(new Map());

  useEffect(() => {
    const fetchProducts = async () => {
      if (!products || !products.length) {
        try {
          const response = await fetch("/api/products?depth=0&limit=9999");
          ({ docs: products } = await response.json());
        } catch (err) {
          console.error(err);
        }
      }

      const freshIndex = new Map<string | number, Product>();
      const unflattened = products.reduce(
        (acc: AllProducts, product: Product) => {
          if (!Object.hasOwn(acc, product.category)) {
            acc[product.category] = [];
          }
          acc[product.category].push({
            product: product.product,
            id: product.id,
          });
          freshIndex.set(product.id, product);
          return acc;
        },
        {},
      );
      setIndex(freshIndex);
      setAllProducts(unflattened);
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (current) {
      // console.log("***current", current);
      setCurrent(current);
    }
  }, [current]);

  const onChangeHandler = (newValue) => {
    if (onChange) {
      // console.log("***newValue1", newValue);
      setCurrent(newValue);
      if (useObjects) {
        return onChange(newValue.map((id) => index.get(id)));
      }
      return onChange(newValue);
    }
    // console.log("***newValue2", newValue);
    return setCurrent(newValue);
  };

  return (
    allProducts && (
      <FormControl my={4}>
        {label ? (
          <FormLabel fontSize={"small"}>
            {label + (required ? " (Required)" : "")}
          </FormLabel>
        ) : null}
        {description ? <FormHelperText>{description}</FormHelperText> : null}
        <CheckboxGroup
          colorScheme="green"
          onChange={onChangeHandler}
          value={
            current && current.length && typeof current[0] !== "string"
              ? current.map((p) => p.id)
              : current
          }
        >
          <Wrap marginTop={4} spacing={8}>
            {Object.entries(allProducts).map(([category, products]) => {
              return (
                <Stack spacing={8} key={category}>
                  <Heading
                    as="div"
                    fontFamily={"font.body"}
                    textStyle="h4"
                    size="xs"
                  >
                    {category == "non_food"
                      ? "Non-food"
                      : category == "prepared_food"
                      ? "Prepared food"
                      : category == "baked_goods"
                      ? "Baked goods"
                      : category == "value_added_products"
                      ? "Value-added products"
                      : category == "dried_goods"
                      ? "Dried goods"
                      : category}
                  </Heading>
                  <Stack spacing={2}>
                    {products.map((product) => (
                      <Checkbox value={product.id} key={product.id}>
                        {product.product}
                      </Checkbox>
                    ))}
                  </Stack>
                </Stack>
              );
            })}
          </Wrap>
        </CheckboxGroup>
      </FormControl>
    )
  );
};
