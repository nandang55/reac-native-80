import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import {
  PutFirebaseModifyInterface,
  PutModifyInterface,
  ResponseModifyInterface
} from 'interfaces/ProfileInterface';

const putModifyPhone = async (body: PutModifyInterface): Promise<ResponseModifyInterface> => {
  const { data } = await axiosServiceInstance.put('/users/modify_phone', body);
  return data;
};

const putFirebaseModifyPhone = async (
  body: PutFirebaseModifyInterface
): Promise<ResponseModifyInterface> => {
  const { data } = await axiosServiceInstance.put('/users/modify_phone_firebase', body);
  return data;
};

export function usePutModifyPhone(
  options: UseMutationOptions<
    ResponseModifyInterface,
    AxiosError<ResponseModifyInterface>,
    PutModifyInterface
  >
) {
  return useMutation<
    ResponseModifyInterface,
    AxiosError<ResponseModifyInterface>,
    PutModifyInterface
  >(putModifyPhone, options);
}

export function usePutFirebaseModifyPhone(
  options: UseMutationOptions<
    ResponseModifyInterface,
    AxiosError<ResponseModifyInterface>,
    PutFirebaseModifyInterface
  >
) {
  return useMutation<
    ResponseModifyInterface,
    AxiosError<ResponseModifyInterface>,
    PutFirebaseModifyInterface
  >(putFirebaseModifyPhone, options);
}
