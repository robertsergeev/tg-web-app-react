import React, { useCallback, useEffect, useState } from "react";
import "./ProductList.css";
import ProductItem from "../ProductItem.jsx/ProductItem";
import { useTelegram } from "../../hooks/useTelegram";

const products = [
    { id: 1, title: "Товар 1", price: 6.0, description: "Описание первого " },
    { id: 2, title: "Товар 2", price: 10.0, description: "Описание второго " },
    { id: 3, title: "Товар 3", price: 16.0, description: "Описание третьего " },
    { id: 4, title: "Товар 4", price: 2.0, description: "Описание четвертого" },
    { id: 5, title: "Товар 5", price: 5.0, description: "Описание пятого " },
    { id: 6, title: "Товар 6", price: 4.0, description: "Описание шестого " },
    { id: 7, title: "Товар 7", price: 3.0, description: "Описание седьмого " },
    { id: 8, title: "Товар 8", price: 6.0, description: "Описание восьмого " },
];

const getTotalPrice = (items) => {
    return items.reduce((acc, item) => {
        return (acc += item.price);
    }, 0);
};

const ProductList = () => {
    const [addedItems, setAddedItems] = useState([]);
    const { tg, queryId } = useTelegram();

    const onSendData = useCallback(() => {
        const data = {
            products: addedItems,
            totalPrice: getTotalPrice(addedItems),
            queryId,
        };

        fetch("https://tg-web-app-node-tbuw.onrender.com/web-data", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        });
    }, [addedItems, queryId]);

    useEffect(() => {
        tg.onEvent("mainButtonClicked", onSendData);
        return () => {
            tg.offEvent("mainButtonClicked", onSendData);
        };
    }, [onSendData]);

    const onAdd = (product) => {
        const alreadyAdded = addedItems.find((item) => item.id === product.id);
        let newItems = [];

        if (alreadyAdded) {
            newItems = addedItems.filter((item) => item.id !== product.id);
        } else {
            newItems = [...addedItems, product];
        }

        setAddedItems(newItems);

        if (newItems.length === 0) {
            tg.MainButton.hide();
        } else {
            tg.MainButton.show();
            tg.MainButton.setParams({
                text: `Купить ${getTotalPrice(newItems)}`,
            });
        }
    };

    return (
        <div className="list">
            {products.map((item) => (
                <ProductItem
                    key={item.id}
                    product={item}
                    onAdd={onAdd}
                    className={item}
                />
            ))}
        </div>
    );
};

export default ProductList;
