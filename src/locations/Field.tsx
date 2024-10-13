import { FieldExtensionSDK } from "@contentful/app-sdk";
import { Box, Flex, TextInput } from "@contentful/f36-components";
import { DeleteIcon } from "@contentful/f36-icons";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const APP_ID = "1bd0d702";
const APP_KEY = "32b6ab458c23061345da3a4540c17a11";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const fieldValue = sdk.field.getValue();
  const initialRows: Ingredient[] = fieldValue || [];

  const [rows, setRows] = useState<Ingredient[]>(initialRows);
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
        text: value,
        parsed: foodData.ingredients[0]?.parsed,
      },
    ];
    setRows(newRows);
    sdk.field.setValue(newRows);

    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") processEntry();
  };

  const onDeleteButtonClicked = (passedRow: Ingredient) => {
    const updatedRows = rows.filter(row => row !== passedRow);
    setRows(updatedRows);
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  return (
    <>
      <Flex flexDirection="column">
        {rows.map(row => {
          const parsed = row.parsed;
          const foodData = parsed ? parsed[0] : undefined;
          // console.log(JSON.stringify(row));
          // const {quantity} = foodData
          return (
            <Box key={row.id} padding="spacingXs" marginRight="spacingM">
              <Flex justifyContent="space-between">
                <span>
                  <strong>
                    {foodData?.quantity} {foodData?.measure}
                  </strong>{" "}
                  {foodData?.foodMatch}
                </span>
                <DeleteIcon variant="primary" onClick={() => onDeleteButtonClicked(row)} />
              </Flex>
            </Box>
          );
        })}
      </Flex>
      <TextInput
        type="email"
        name="email"
        placeholder="Add an ingredient"
        onKeyDown={onKeyDown}
        onChange={e => setValue(e.target.value)}
        // onBlur={processEntry}
        value={value}
        autoComplete="false"
      />
    </>
  );
};

export default Field;
