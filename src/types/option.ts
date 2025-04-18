
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

export interface ProductType {
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
}

export interface ProductOptionType {
  id: number;
  serviceProductId: number
  optionId:number
  optionPrice:number
  optionType:string
  value: string
}
export interface RoomTypeData{
  name:string
  description : string
  status : string
}

export interface  ReservationType{
  id:number
  userId: number
  serviceId: number
  reservationType: string
  status: string
  totalPrice: number
  arrivedDate:string
  departDate:string
  reservationTime:string
  reservationProduct:number
  comment:string
  createdBy: number
  lastModifiedBy: number
  payment:string
}

export interface userDataType {
  id:number
  firstName: string
  lastName : string
  email:string
  phoneNumber:number
  roleId:number
}

export interface serviceType{
  name:string
  description:string
  paymentMethods: []

}
