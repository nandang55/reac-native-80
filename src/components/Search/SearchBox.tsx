import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Icon } from 'components/Icon';
import { InputText } from 'components/Input';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchBox } from 'react-instantsearch-core';
import { BackHandler, TextInput, TouchableOpacity, View } from 'react-native';
import colors from 'styles/colors';

type SearchComponentStackProps = StackNavigationProp<RootStackParamList, 'SearchStack'>;

export const SearchBox = ({ from }: { from?: string }) => {
  const navigation = useNavigation<SearchComponentStackProps>();

  const inputRef = useRef<TextInput>(null);

  const { query, refine, clear } = useSearchBox({
    queryHook: useMemo(() => {
      return (kueri, search) => {
        const debouncedRefine = debounce(search, 200);
        debouncedRefine(kueri);
      };
    }, [])
  });

  const [inputValue, setInputValue] = useState(query);

  const debounce = <T extends (...args: Array<never>) => void>(fn: T, delay: number) => {
    let timeoutId: NodeJS.Timeout;

    return (...args: Parameters<T>): void => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => fn(...args), delay);
    };
  };

  const setQuery = (newQuery: string) => {
    setInputValue(newQuery);
    refine(newQuery);
  };

  const onClear = () => {
    clear();
    setInputValue('');
  };

  if (query !== inputValue && !inputRef.current?.isFocused()) {
    setInputValue(query);
  }

  useFocusEffect(
    useCallback(() => {
      const timeoutId = setTimeout(() => {
        inputRef.current?.focus();
      }, 800);

      return () => clearTimeout(timeoutId);
    }, [])
  );

  useEffect(() => {
    const backHandler = BackHandler.addEventListener('hardwareBackPress', () => {
      handleBackButton();
      return true;
    });

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigation]);

  const handleBackButton = () => {
    navigation.goBack();
    onClear();
  };

  return (
    <>
      <View style={{ flexDirection: 'row', alignItems: 'center', paddingBottom: 16 }}>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => {
            navigation.goBack();
            onClear();
          }}
        >
          <Icon name="close" color={colors.dark.blackCoral} size="30" />
        </TouchableOpacity>
        <View style={{ flexBasis: '89%' }}>
          <InputText
            ref={inputRef}
            value={inputValue}
            onChange={setQuery}
            inputStyle={{ color: colors.dark.gumbo }}
            rightIcon="search"
            rightIconPress={() =>
              inputValue &&
              navigation.navigate('SearchStack', {
                screen: 'Search',
                params: { query: inputValue, from: from || '' }
              })
            }
            isClearable
            onClear={onClear}
            returnKeyType="search"
            onSubmitEditing={() =>
              inputValue &&
              navigation.navigate('SearchStack', {
                screen: 'Search',
                params: { query: inputValue, from: from || '' }
              })
            }
          />
        </View>
      </View>
    </>
  );
};
