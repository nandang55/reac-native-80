import { useMutation, UseMutationOptions } from '@tanstack/react-query';
import { AxiosError } from 'axios';
import { axiosServiceInstance } from 'core/axios/axiosInstance';
import { TokenInterface } from 'interfaces/LoginInterface';
import { LanguageType } from 'interfaces/TranslationInterface';

const postUpdateLanguage = async (body: LanguageType): Promise<TokenInterface> => {
  const { data } = await axiosServiceInstance.post('/users/language', { lang: body });
  return data;
};

export function usePostUpdateLanguage(
  options: UseMutationOptions<TokenInterface, AxiosError<TokenInterface>, LanguageType>
) {
  return useMutation<TokenInterface, AxiosError<TokenInterface>, LanguageType>(
    postUpdateLanguage,
    options
  );
}
