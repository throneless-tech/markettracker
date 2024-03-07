import React, { FC, useEffect, useState } from "react";
import qs from "qs";
import type { Props } from "payload/components/views/Cell";
import { Tag } from "@chakra-ui/react";
import type { Product } from "payload/generated-types";

type CellData = {
  cellData: any;
};

export const ProductsCell: FC<Props | CellData> = ({ cellData }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (cellData) {
      const query = {
        id: {
          in: cellData.join(","),
        },
      };

      const stringifiedQuery = qs.stringify(
        {
          where: query,
          limit: 9999,
          depth: 0,
        },
        { addQueryPrefix: true },
      );
      const fetchProducts = async () => {
        try {
          const response = await fetch(`/api/products${stringifiedQuery}`);
          if (!response.ok) throw new Error(response.statusText);
          const res = await response.json();
          setProducts(res.docs);
        } catch (err) {
          console.error(err);
        }
      };
      fetchProducts();
    }
  }, [cellData]);

  return products ? (
    <>
      {products.length
        ? products.map((product) => (
            <Tag marginRight={2}>{product.product}</Tag>
          ))
        : ""}
    </>
  ) : null;
};
