type Ingredient = {
  id: string;
  text: string;
  parsed?: Parsed[];
};

interface Parsed {
  quantity: number;
  measure: string;
  foodMatch: string;
  food: string;
  foodId: string;
  weight: number;
  retainedWeight: number;
  nutrients: Nutrients;
  measureURI: string;
  status: string;
}

interface Nutrients {
  VITD: Nutrient;
  FATRN: Nutrient;
  ENERC_KCAL: Nutrient;
  FASAT: Nutrient;
  VITA_RAE: Nutrient;
  PROCNT: Nutrient;
  TOCPHA: Nutrient;
  CHOLE: Nutrient;
  CHOCDF: Nutrient;
  FAT: Nutrient;
  FIBTG: Nutrient;
  RIBF: Nutrient;
  THIA: Nutrient;
  FAPU: Nutrient;
  NIA: Nutrient;
  VITC: Nutrient;
  FAMS: Nutrient;
  VITB6A: Nutrient;
  VITB12: Nutrient;
  WATER: Nutrient;
  K: Nutrient;
  P: Nutrient;
  NA: Nutrient;
  ZN: Nutrient;
  SUGAR: Nutrient;
  CA: Nutrient;
  MG: Nutrient;
  FE: Nutrient;
  VITK1: Nutrient;
  FOLFD: Nutrient;
  FOLAC: Nutrient;
  FOLDFE: Nutrient;
}

interface Nutrient {
  label: string;
  quantity: number;
  unit: string;
}
