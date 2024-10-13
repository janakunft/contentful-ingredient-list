import { FieldExtensionSDK } from "@contentful/app-sdk";
import { Box, Flex, TextInput, DragHandle } from "@contentful/f36-components";
import { DeleteIcon } from "@contentful/f36-icons";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IngredientLine } from "../types";

const APP_ID = "1bd0d702";
const APP_KEY = "32b6ab458c23061345da3a4540c17a11";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldValue = sdk.field.getValue();
  const initialRows: IngredientLine[] = fieldValue || [];

  const [rows, setRows] = useState<IngredientLine[]>(initialRows);
  const [value, setValue] = useState("");

  const getFoodData = async () => {
    const response = await fetch(
      `https://api.edamam.com/api/nutrition-data?app_id=${APP_ID}&app_key=${APP_KEY}&nutrition-type=cooking&ingr=${value}`
    );
    return await response.json();
  };

  const processEntry = async () => {
    const foodData = await getFoodData();
    console.log(foodData);
    const newRows = [
      ...rows,
      {
        id: uuidv4(),
        rawText: value,
        ...foodData,
      },
    ];
    setRows(newRows);
    sdk.field.setValue(newRows);

    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") processEntry();
  };

  const onDeleteButtonClicked = (passedRow: IngredientLine) => {
    const updatedRows = rows.filter(row => row !== passedRow);
    setRows(updatedRows);
    sdk.field.setValue(updatedRows);
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  return (
    <>
      <Flex flexDirection="column">
        {rows.map(row => {
          const ingredient = row.ingredients?.[0]?.parsed?.[0];
          return (
            <Flex justifyContent="space-between">
              <Flex>
                <DragHandle variant="transparent" label="Transparent drag handle" />
                <span>
                  <strong>
                    {ingredient?.quantity} {ingredient?.measure}
                  </strong>{" "}
                  {ingredient?.foodMatch}
                </span>
              </Flex>
              <DeleteIcon variant="primary" onClick={() => onDeleteButtonClicked(row)} />
            </Flex>
          );
        })}
      </Flex>
      <TextInput
        type="email"
        name="email"
        placeholder="Add an ingredient"
        onKeyDown={onKeyDown}
        onChange={e => setValue(e.target.value)}
        value={value}
        autoComplete="false"
      />
    </>
  );
};

export default Field;
