
export interface OptionType {
  id: number;
  optionName: string;
  type: 'select' | 'text' | 'number' | 'picklist';
  values: { label: string; value: string }[];
  isDefault: boolean;
}

export interface ServiceProductType {
  id: number;
  serviceId: number
  productName:string
  productType:string
  price:number
  description: string
  availability: boolean
  customizationAllowed:boolean
  paymentType:string
  status:string
  options:ProductOptionType[];
}

export interface ProductOptionType {
  id: number;
  serviceProductId: number
  optionId:number
  optionPrice:number
  optionType:string
  value: string
}
