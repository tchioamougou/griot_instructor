import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { OptionType,ServiceProductType,ProductOptionType,RoomTypeData,ReservationType,userDataType} from '@/types/option'


const API_URL = import.meta.env.VITE_API_URL as string

// --- Types ---
export interface Option {
  id?: number
  name: string
  description?: string

  // ajoute d'autres champs selon ton modèle
}

export interface CreateRoomData {
  service_id:number
  product_name: string
  product_type:string
  description: string
  // availability:boolean
  status: string
  price: string
}

export interface RoomOptionData {
  service_product_id: number
  option_id: number
  option_type: string
  value:string
}


export interface serviceType{
  name:string
  description:string
  paymentMethods: { label: string; value: string }[];

}



// --- Services API ---
//get les options
export const getOptions = (): Promise<AxiosResponse<{ data: OptionType[] }>> => {
  return axios.get(`${API_URL}/option`)
}
//get les services product by serviceId
export const getServiceProduct = (
  serviceId: number
): Promise<AxiosResponse<ServiceProductType[]>> => {
  return axios.get(`${API_URL}/service_product_by_serviceId/${serviceId}`);
};



//get les productOptions
export const getProductOption = (): Promise<AxiosResponse<{ data: ProductOptionType[] }>> => {
  return axios.get(`${API_URL}/production_option`)
}

export const getService = (serviceId?: number): Promise<AxiosResponse< serviceType[] >> => {
  return axios.get(`${API_URL}/services/${serviceId}`)
}

//get les services products avc les options et  sans les options en fonctions de l id du services
export const getServiceProductWithOptions = (
  serviceId?: number
): Promise<AxiosResponse<{ data: ServiceProductType[] }>> => {
  const url = serviceId
    ? `${API_URL}/service_product_options?serviceId=${serviceId}`
    : `${API_URL}/service_product_options`

  return axios.get(url)
}


export const getTypeProduct = (): Promise<AxiosResponse<{ data: RoomTypeData[] }>> => {
  return axios.get(`${API_URL}/product`);
};

export const getUser = (): Promise<AxiosResponse<{ data: userDataType[] }>> => {
  return axios.get(`${API_URL}/users`);
};

export const getReservation = (serviceId: number): Promise<AxiosResponse<ReservationType[]>> => {
  return axios.get(`${API_URL}/reservations/${serviceId}`);
};

export const createRoom = (
  roomData: CreateRoomData
): Promise<AxiosResponse<{ id: number }>> => {
  return axios.post(`${API_URL}/service_product`, roomData);
};


export const createRoomOptions = (optionsData: { data: RoomOptionData[] }):Promise<AxiosResponse<any>> => {
     return axios.post(`${API_URL}/production_option`, optionsData);
   };

   export const createUser = (userData: userDataType[]):Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/users`, userData);
  };

   export const createRoomType = (roomTypeData: { data: RoomTypeData[] }):Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/product`, roomTypeData);
  };


export const createReservation = (reservationData: ReservationType[] ):Promise<AxiosResponse<any>> => {
    return axios.post(`${API_URL}/reservationswithuser`, reservationData);
};




