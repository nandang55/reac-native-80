import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import {
  PostBodyLoginFirebaseInterface,
  PostBodyLoginInterface,
  ResponseLoginInterface
} from 'interfaces/LoginInterface';

const postLoginByPhone = async (body: PostBodyLoginInterface): Promise<ResponseLoginInterface> => {
  const { data } = await axiosServiceInstance.post('/login_by_phone', body);
  return data;
};

const postCheckUserByPhone = async (
  body: PostBodyLoginInterface
): Promise<ResponseLoginInterface> => {
  const { data } = await axiosServiceInstance.post('/checkUserByPhone', body);
  return data;
};

const postLoginByEmail = async (body: PostBodyLoginInterface): Promise<ResponseLoginInterface> => {
  const { data } = await axiosServiceInstance.post('/login_by_email', body);
  return data;
};

const postLoginByFirebase = async (
  body: PostBodyLoginFirebaseInterface
): Promise<ResponseLoginInterface> => {
  const { data } = await axiosServiceInstance.post('/login_by_firebase', body);
  return data;
};

export function usePhoneLogin(
  options: UseMutationOptions<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginInterface
  >
) {
  return useMutation<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginInterface
  >(postLoginByPhone, options);
}

export function useCheckUserByPhoneLogin(
  options: UseMutationOptions<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginInterface
  >
) {
  return useMutation<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginInterface
  >(postCheckUserByPhone, options);
}

export function useEmailLogin(
  options: UseMutationOptions<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginInterface
  >
) {
  return useMutation<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginInterface
  >(postLoginByEmail, options);
}

export function useFirebaseLogin(
  options: UseMutationOptions<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginFirebaseInterface
  >
) {
  return useMutation<
    ResponseLoginInterface,
    AxiosError<ResponseLoginInterface>,
    PostBodyLoginFirebaseInterface
  >(postLoginByFirebase, options);
}
