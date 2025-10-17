import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Text } from 'components/Text';
import { HomeStackParamList } from 'navigators/HomeStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { forwardRef } from 'react';
import { Configure, useInfiniteHits, useSearchBox } from 'react-instantsearch-core';
import { FlatList, Image, Text as RNText, TouchableOpacity, View } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

import { Highlight } from './components/highlight';
import { SearchResultInterface } from './SearchResult.type';

type SearchResultScreenProps = StackNavigationProp<RootStackParamList & HomeStackParamList>;

const Border = styled(View)<{ color?: string }>`
  border: 0.6px solid ${(props) => props.color || colors.dark.silver};
`;

export const SearchResult = forwardRef<FlatList, SearchResultInterface>(
  ({ data, ...props }, ref) => {
    const navigation = useNavigation<SearchResultScreenProps>();

    const { items } = useInfiniteHits({
      ...props,
      escapeHTML: false
    });

    const { query } = useSearchBox();

    const handleOnDetailProduct = ({ id, title }: { id: string; title: string }) => {
      navigation.navigate('ProductStack', {
        screen: 'ProductDetail',
        params: { id, title, from: props?.from || '' }
      });
    };

    const handleOnDetailCategory = ({ id, title }: { id: string; title: string }) => {
      navigation.navigate('CategoryCatalogue', { title, id, from: props?.from || '' });
    };

    return (
      <>
        <View style={{ flex: 1 }}>
          <Configure hitsPerPage={5} />
          <View>
            <FlatList
              ref={ref}
              data={data}
              keyExtractor={(item) => item.id}
              ItemSeparatorComponent={() => <Border color={colors.dark.solitude} />}
              scrollEnabled={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={{ padding: 16 }}
                  onPress={() => handleOnDetailCategory({ id: item.id, title: item.name })}
                >
                  <CustomHighlight text={item.name} query={query} />
                </TouchableOpacity>
              )}
              ListHeaderComponent={
                (data?.length || 0) > 0 ? (
                  <Text
                    label="Related Categories"
                    fontWeight="bold"
                    color={colors.dark.blackCoral}
                    variant="small"
                  />
                ) : null
              }
              ListHeaderComponentStyle={{
                paddingTop: 12
              }}
            />
          </View>

          <FlatList
            ref={ref}
            data={items}
            scrollEnabled={false}
            keyExtractor={(item) => item.objectID}
            ItemSeparatorComponent={() => <Border color={colors.dark.solitude} />}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={{
                  padding: 16,
                  alignItems: 'center',
                  gap: 12,
                  flexDirection: 'row',
                  width: '90%'
                }}
                onPress={() => handleOnDetailProduct({ id: item.id, title: item.name })}
              >
                <Image
                  source={{ uri: item.main_image_link as string }}
                  style={{ aspectRatio: 1, width: 32, borderRadius: 7 }}
                />
                <RNText allowFontScaling={false}>
                  <Highlight hit={item} attribute="name" />
                </RNText>
              </TouchableOpacity>
            )}
            ListHeaderComponent={
              items.length > 0 ? (
                <Text
                  label="Related Products"
                  fontWeight="bold"
                  color={colors.dark.blackCoral}
                  variant="small"
                />
              ) : null
            }
            ListHeaderComponentStyle={{
              paddingTop: 12
            }}
          />
        </View>
      </>
    );
  }
);

const CustomHighlight = ({ text, query }: { text: string; query: string }) => {
  if (!query) return <Text label={text} color={colors.dark.blackCoral} />;

  const renderHighlightedText = () => {
    const regex = new RegExp(`(${query})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) => (
      <RNText
        key={index}
        style={{
          fontWeight: part.toLowerCase() === query.toLowerCase() ? 'bold' : 'normal',
          color: colors.dark.blackCoral,
          fontSize: 15
        }}
        allowFontScaling={false}
      >
        {part}
      </RNText>
    ));
  };

  return <RNText>{renderHighlightedText()}</RNText>;
};

SearchResult.displayName = 'SearchResult';
