import { _storeLocalStorageItem } from 'core/utils/localStorage';
import { LanguageInterface } from 'interfaces/TranslationInterface';
import { useCallback } from 'react';
import { useTranslation } from 'react-i18next';

const useChangeLanguage = (params?: { postLang: boolean }) => {
  const { i18n } = useTranslation();

  const changeLanguage = useCallback(
    async (selectLang: string) => {
      const language: LanguageInterface = {
        // eslint-disable-next-line camelcase
        id_ID: 'id',
        // eslint-disable-next-line camelcase
        en_US: 'en'
      };
      const lang = selectLang === 'en' ? 'en_US' : 'id_ID';

      i18n.changeLanguage(language[lang]);

      await _storeLocalStorageItem({
        storageKey: 'I18nLang',
        storageValue: language[lang]
      });
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [i18n, params]
  );

  return {
    changeLanguage
  };
};

export default useChangeLanguage;
