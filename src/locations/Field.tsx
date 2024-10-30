import { FieldExtensionSDK } from "@contentful/app-sdk";
import { Flex, TextInput } from "@contentful/f36-components";
import { useCMA, useSDK } from "@contentful/react-apps-toolkit";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { IngredientLine } from "../types";
import IngredientRow from "../components/IngredientRow";

const API_BASE_URL = "https://api.edamam.com/api";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const cma = useCMA();
  const fieldId = sdk.field.id;
  const { edamamApiKey, edamamAppId } = sdk.parameters.instance;
  const fieldValue = sdk.field.getValue();
  const initialRows: IngredientLine[] = fieldValue || [];

  const [rows, setRows] = useState<IngredientLine[]>(initialRows);
  const [value, setValue] = useState("");

  const getFoodData = async () => {
    const response = await fetch(
      `${API_BASE_URL}/nutrition-data?app_id=${edamamAppId}&app_key=${edamamApiKey}&nutrition-type=cooking&ingr=${value}`
    );
    return await response.json();
  };

  const processEntry = async () => {
    const foodData = await getFoodData();
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
    // sdk.entry.fields[fieldId].setValue(newRows, "de");
    // cma.entry
    //   .getMany({
    //   query: {
    //     content_type: "product",
    //     "fields.internalName": "Jim's legendary coffee mug",
    //   },
    //   })
    //   .then(entries => {
    //   if (entries.items.length === 0) {
    //     sdk.dialogs.openExtension({
    //     title: "Create New Product",
    //     width: 800,
    //     parameters: {
    //       internalName: "Jim's legendary coffee mug",
    //     },
    //     }).then((newEntry) => {
    //     if (newEntry) {
    //       console.log("New product entry created:", newEntry);
    //     }
    //     }).catch(error => {
    //     console.error("Error opening dialog:", error);
    //     });
    //   } else {
    //     console.log(entries.items);
    //   }
    //   })
    //   .catch(error => {
    //   console.error("Error fetching entries:", error);
    //   });
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
      <Flex flexDirection="column" gap="8px" style={{ marginTop: "8px", marginBottom: "16px" }}>
        {rows.map(row => (
          <IngredientRow onDeleteButtonClicked={onDeleteButtonClicked} row={row} key={row.id} />
        ))}
      </Flex>
      <TextInput
        name="ingredient"
        placeholder="Add an ingredient"
        onKeyDown={onKeyDown}
        onChange={e => setValue(e.target.value)}
        value={value}
      />
    </>
  );
};

export default Field;
