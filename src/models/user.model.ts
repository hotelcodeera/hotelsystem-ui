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

export interface CreateUserRequest {
  username: string;
  email: string;
  firstName?: string;
  lastName?: string;
  userType: UserType;
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

export interface UnRegisteredStudents {
  userId: string;
  userName: string;
}

export interface StudentGrades {
  subject: string;
  grade: number;
}

export interface StudentRegistration {
  _id: string;
  userId: string;
  examId: string;
  created?: string;
  updated?: string;
  studentGrades?: StudentGrades[];
}

export interface StudentRegistrationResponse {
  _id: string;
  userId: string;
  userName: string;
  examId: string;
  created?: string;
  updated?: string;
  studentGrades?: StudentGrades[];
}
export interface StudentRegistrationResponseWithUser {
  _id: string;
  examId: string;
  created?: string;
  updated?: string;
  studentGrades?: StudentGrades[];
  userDetails: User;
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
  success: boolean;
  token: string;
}

export const MOCK_EXAM_REGISTRATION: StudentRegistrationResponse[] = [
  {
    _id: 'weafguehwagf weuaf',
    userId: 'awefuehwbg fwhebfh',
    examId: 'eawfh uwehfu',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    userName: 'waefaefwaewf',
    studentGrades: [
      {
        subject: 'PHYSICS',
        grade: 3,
      },
      {
        subject: 'MATHS',
        grade: 2,
      },
      {
        subject: 'CHEMISTRY',
        grade: 4,
      },
    ],
  },
  {
    _id: 'weafgGFBDHSTRGERGf',
    userId: 'awefuehwbg fwhebfh',
    examId: 'eawfh uwehfu',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    userName: 'waefaefwaewf',
    studentGrades: [
      {
        subject: 'PHYSICS',
        grade: 2,
      },
      {
        subject: 'MATHS',
        grade: 1,
      },
      {
        subject: 'CHEMISTRY',
        grade: 4,
      },
    ],
  },
  {
    _id: 'EWAFUHAWEFAWEF',
    userId: 'awefuehwbg fwhebfh',
    userName: 'waefaefwaewf',
    examId: 'eawfh uwehfu',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    studentGrades: [],
  },
  {
    _id: 'EWAFUHAWEFAWEF',
    userId: 'awefuehwbg fwhebfh',
    examId: 'eawfh uwehfu',
    userName: 'waefaefwaewf',
    created: new Date().toISOString(),
    updated: new Date().toISOString(),
    studentGrades: undefined,
  },
];

export const MOCK_EXAMS: ExamListResponse[] = [
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

export const MOCK_UNREGISTERED_USERS: UnRegisteredStudents[] = [
  {
    userId: 'WEAFHBWABFWAHEBF',
    userName: 'ewafewafewaf',
  },
  {
    userId: 'waefafwaef',
    userName: 'awefawef',
  },
];

export interface CreateExamRequest {
  name: string;
  description: string;
}

export interface RegisterStudentRequest {
  examId: string;
  userId: string;
}

export interface StudentGrade {
  maths: number;
  physics: number;
  chemistry: number;
  examId: string;
  userId: string;
  requestId: string;
}

export const MOCK_JWT =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MmIwMDA0N2ZlYmFiMjc0Njk2ZjFkNzMiLCJpZCI6IjYyYjAwMDQ3ZmViYWIyNzQ2OTZmMWQ3MyIsInVzZXJUeXBlIjoiUFJPRkVTU09SIiwidXNlcm5hbWUiOiJ0ZXN0cHJvZmVzc29yIiwiZmlyc3ROYW1lIjoidGVzdCIsImxhc3ROYW1lIjoicHJvZmVzc29yIiwiZW1haWwiOiJ0ZXN0cHJvZmVzc29yQGdtYWlsLmNvbSIsImlhdCI6MTY1NTcwNTUxMiwiZXhwIjoxNjU1NzA4NTEyfQ.-QstxJ_rqBKi2KhpAUtDT-6y6Dv4EVgeZMQ_hW38x68';

export const SUBJECTS_COUNT = 3;

export const CANCEL_STATUS = 'CANCEL';

export interface StudentRegistrationDetailResponse {
  _id: string;
  name: string;
  description: string;
  studentGrades?: StudentGrades[];
  isNotRegistered?: boolean;
}

export const MOCK_STUDENT_REGISTRATION: StudentRegistrationDetailResponse = {
  _id: 'EWAFAWFEAWF',
  name: 'ahbewfbgwaef weafj',
  description: 'aewhf weaf wauf w fwefewafb we wef we ufw ef',
  studentGrades: [
    {
      subject: 'maths',
      grade: 2,
    },
    {
      subject: 'physics',
      grade: 3,
    },
    {
      subject: 'chemistry',
      grade: 5,
    },
  ],
  isNotRegistered: true,
};

export const MOCK_STUDENT_REGISTRATION_PENDING: StudentRegistrationDetailResponse = {
  _id: 'EWAFAWFEAWF',
  name: 'ahbewfbgwaef weafj',
  description: 'aewhf weaf wauf w fwefewafb we wef we ufw ef',
  studentGrades: [],
  isNotRegistered: false,
};
