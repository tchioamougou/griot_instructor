import axios from 'axios'
import type { AxiosResponse } from 'axios'
import type { OptionType,ServiceProductType,ProductOptionType } from '@/types/option'


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




// --- Services API ---
export const getOptions = (): Promise<AxiosResponse<{ data: OptionType[] }>> => {
  return axios.get(`${API_URL}/option`)
}

export const getServiceProduct = (): Promise<AxiosResponse<{ data: ServiceProductType[] }>> => {
  return axios.get(`${API_URL}/service_product`)
}

export const getProductOption = (): Promise<AxiosResponse<{ data: ProductOptionType[] }>> => {
  return axios.get(`${API_URL}/production_option`)
}
export const getServiceProductWithOptions = (): Promise<AxiosResponse<{ data: ServiceProductType[] }>> => {
  return axios.get(`${API_URL}/service_product_options`);
};


export const createRoom = (
  roomData: CreateRoomData
): Promise<AxiosResponse<{ id: number }>> => {
  return axios.post(`${API_URL}/service_product`, roomData);
};


export const createRoomOptions = (optionsData: { data: RoomOptionData[] }):Promise<AxiosResponse<any>> => {
     return axios.post(`${API_URL}/production_option`, optionsData);
   };





