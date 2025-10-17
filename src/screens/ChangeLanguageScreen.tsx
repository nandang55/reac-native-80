import { useQueryClient } from '@tanstack/react-query';
import { LayoutScreen } from 'components/layouts';
import { MenuList } from 'components/MenuList';
import { MenuListInterface } from 'components/MenuList/MenuList.type';
import { LoadingContext } from 'contexts/AppLoadingContext';
import useChangeLanguage from 'core/hooks/useChangeLanguage';
import useAuth from 'hooks/useAuth';
import { usePostUpdateLanguage } from 'hooks/useUpdateLanguage';
import { LanguageType } from 'interfaces/TranslationInterface';
import React, { useContext, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

const ChangeLanguageContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  padding: 0 16px;
`;

const renderItem = ({ item }: { item: MenuListInterface }) => {
  return <MenuList {...item} />;
};

const ChangeLanguageScreen = () => {
  const queryClient = useQueryClient();
  const { changeLanguage } = useChangeLanguage({ postLang: true });
  const { i18n, t } = useTranslation(['language']);
  const { signIn } = useAuth();
  const { setLoading } = useContext(LoadingContext);

  const { mutateAsync: updateLanguage, isLoading } = usePostUpdateLanguage({
    onSuccess: async (res) => {
      await signIn(res);
      queryClient.invalidateQueries();
    }
  });

  const DATA_MENU_LIST: Array<MenuListInterface> = [
    {
      type: 'secondary',
      label: t('language:english'),
      selected: i18n.language === 'en',
      onPress: () => handleChangeLanguage('en')
    },
    {
      type: 'secondary',
      label: t('language:bahasaIndonesia'),
      selected: i18n.language === 'id',
      onPress: () => handleChangeLanguage('id')
    }
  ];

  const handleChangeLanguage = async (lang: LanguageType) => {
    await changeLanguage(lang);
    await updateLanguage(lang);
  };

  useEffect(() => setLoading(isLoading), [isLoading, setLoading]);

  return (
    <>
      <LayoutScreen isNoPadding>
        <ChangeLanguageContainer>
          <FlatList
            data={DATA_MENU_LIST}
            renderItem={renderItem}
            keyExtractor={(_, index) => index.toString()}
            contentContainerStyle={{ paddingTop: 16, gap: 8 }}
          />
        </ChangeLanguageContainer>
      </LayoutScreen>
    </>
  );
};

export default ChangeLanguageScreen;
