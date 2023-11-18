export interface User {
  _id: string;
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  password?: string;
  userType: UserType;
  created?: string;
  updated?: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export enum UserType {
  User = 'USER',
  Admin = 'ADMIN',
  Staff = 'STAFF',
}

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
}

export interface ProductDetails {
  _id: string;
  outOfStock: boolean;
  updated: string;
  name: string;
  userId: string;
  description: string;
  price: number;
  waitingTime: number;
  created: string;
}

export interface StaffOrders {
  _id: string;
  outOfStock: boolean;
  updated: string;
  name: string;
  userId: string;
  description: string;
  price: number;
  waitingTime: number;
  created: string;
  orders: {
    _id: string;
    orderStatus: string;
    updated: string;
    productId: string;
    userId: string;
    quantity: number;
    created: string;
  }[];
}

export interface CustomerOrders {
  _id: string;
  orderStatus: string;
  updated: string;
  productId: string;
  userId: string;
  quantity: number;
  created: string;
  productDetails: {
    _id: string;
    outOfStock: boolean;
    updated: string;
    name: string;
    userId: string;
    description: string;
    price: number;
    waitingTime: number;
    created: string;
  };
}

export interface TransformedOrders {
  orderId: string;
  orderStatus: string;
  updated: string;
  productId: string;
  userId: string;
  quantity: number;
  created: string;
  productName: string;
  productDescription: string;
  price: number;
  billAmount: number;
}

export const ACCESS_TOKEN = 'access-token';

export const MOCK_USER = {
  _id: 'dummy',
  firstName: 'dummy',
  lastName: 'dummy',
  email: 'dummy',
  username: 'test',
  userType: UserType.Staff,
};

export interface LoginResponse {
  success: boolean;
  token: string;
}

export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  waitingTime: number;
}

export const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmIwMDA0N2ZlYmFiMjc0Njk2ZjFkNzMiLCJpZCI6IjYyYjAwMDQ3ZmViYWIyNzQ2OTZmMWQ3MyIsInVzZXJUeXBlIjoiUFJPRkVTU09SIiwidXNlcm5hbWUiOiJ0ZXN0cHJvZmVzc29yIiwiZmlyc3ROYW1lIjoidGVzdCIsImxhc3ROYW1lIjoicHJvZmVzc29yIiwiZW1haWwiOiJ0ZXN0cHJvZmVzc29yQGdtYWlsLmNvbSIsImlhdCI6MTY1NTcwNTUxMiwiZXhwIjoxNjU1NzA4NTEyfQ.-QstxJ_rqBKi2KhpAUtDT-6y6Dv4EVgeZMQ_hW38x68';

export const SUBJECTS_COUNT = 3;

export const CANCEL_STATUS = 'CANCEL';

export const API_VERSION_URL = 'api/v1';
