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

export enum UserType {
  User = 'USER',
  Admin = 'ADMIN',
  Professor = 'PROFESSOR',
}

export interface Exam {
  _id: string;
  name: string;
  description: string;
  userId: string;
  created?: string;
  updated?: string;
}

export interface ExamListResponse {
  _id: string;
  name: string;
  description: string;
  userId: string;
  created?: string;
  updated?: string;
}

export interface StudentGrades {
  subject: string;
  grade: string;
}

export interface StudentRegistration {
  _id: string;
  userId: string;
  examId: string;
  created?: string;
  updated?: string;
  studentGrades?: StudentGrades[];
}

export const ACCESS_TOKEN = 'access-token';

export const MOCK_USER = {
  _id: 'dummy',
  firstName: 'dummy',
  lastName: 'dummy',
  email: 'dummy',
  username: 'test',
  userType: UserType.Professor,
};

export interface LoginResponse {
  result: string;
  data: string;
}

export const MOCK_EXAMS = [
  {
    _id: 'awefaewfwaef',
    name: 'maths',
    description: 'weahfgheb jbweaf wehfh wvefh',
    userId: 'jkaewfhgwafhv weaf',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    _id: 'ecvvgwefawf',
    name: 'physics',
    description: 'weahfgheb jbweaf wehfh wvefh',
    userId: 'jkaewfhgwafhv weaf',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    _id: 'waewfaewgbf',
    name: 'chemistry',
    description: 'weahfgheb jbweaf wehfh wvefh',
    userId: 'jkaewfhgwafhv weaf',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    _id: 'tytryeryeryt',
    name: 'english',
    description: 'weahfgheb jbweaf wehfh wvefh',
    userId: 'jkaewfhgwafhv weaf',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
  {
    _id: 'vbsdgvergv',
    name: 'sanskrit',
    description: 'weahfgheb jbweaf wehfh wvefh',
    userId: 'jkaewfhgwafhv weaf',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
  },
];

export const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiJ9.eyJmaXJzdE5hbWUiOiJkdW1teSIsImxhc3ROYW1lIjoiZHVtbXkiLCJfaWQiOiJJc3N1ZXJld2Fmd2ZlYWZ3IiwidXNlclR5cGUiOiJQUk9GRVNTT1IiLCJ1c2VybmFtZSI6InRlc3RzZXQifQ.6MmA_03Wx9mgaVmcfISG67YMl10xtu_EHK6mtr6q4rQ';
