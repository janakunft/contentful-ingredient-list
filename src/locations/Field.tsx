import { FieldExtensionSDK } from "@contentful/app-sdk";
import { Paragraph, TextInput } from "@contentful/f36-components";
import { useSDK } from "@contentful/react-apps-toolkit";
import { useEffect, useState } from "react";

const Field = () => {
  const sdk = useSDK<FieldExtensionSDK>();
  const initialRows: Ingredient[] = [
    {
      id: "khifehvi01",
      name: "banana",
    },
    {
      id: "kfehvi01",
      name: "egg",
    },
  ];

  const [rows, setRows] = useState<Ingredient[]>(initialRows);
  const [value, setValue] = useState("");

  const processEntry = () => {
    console.log("Processing entry: " + value);
    setRows(prevRows => [
      ...prevRows,
      {
        id: value,
        name: value,
      },
    ]);
    console.log(rows);
    setValue("");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") processEntry();
  };

  useEffect(() => {
    sdk.window.startAutoResizer();
  });

  return (
    <>
      {rows.map(row => (
        <Paragraph key={row.id}>{row.name}</Paragraph>
      ))}
      <TextInput
        type="email"
        name="email"
        placeholder="Add an ingredient"
        onKeyDown={onKeyDown}
        onChange={e => setValue(e.target.value)}
        onBlur={processEntry}
        value={value}
      />
    </>
  );
};

export default Field;
