import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { Hit } from 'algoliasearch/lite';
import { LayoutScreen } from 'components/layouts';
import {
  CategoriesList,
  EmptyQueryBoundary,
  Highlight,
  RecommendedCollection,
  SearchBox,
  SearchResult,
  Suggestions
} from 'components/Search';
import useGetCategoryList from 'hooks/useGetCategoryList';
import useGetCollections from 'hooks/useGetCollections';
import { HomeStackParamList } from 'navigators/HomeStackNavigator';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useRef } from 'react';
import { Configure, useRefinementList, useSearchBox } from 'react-instantsearch-core';
import { FlatList, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import Config from 'react-native-config';
import styled from 'styled-components/native';
import colors from 'styles/colors';

type SearchComponentStackProps = StackNavigationProp<RootStackParamList>;
type SearchSuggestionRouteProps = RouteProp<HomeStackParamList, 'SearchSuggestion'>;

const SearchSuggestionContainer = styled(View)`
  background-color: ${colors.light.whiteSolid};
  flex: 1;
  padding: 16px;
`;

export const SearchSuggestionScreen = () => {
  const route = useRoute<SearchSuggestionRouteProps>();

  const listRef = useRef<FlatList>(null);

  const { refine } = useSearchBox();

  const { items: categories } = useRefinementList({
    attribute: 'category_name'
  });

  const { items: collections } = useRefinementList({
    attribute: 'collections'
  });

  const { data: categoryDataFromApi } = useGetCategoryList({});

  const { data: collectionsDataFromApi } = useGetCollections({});

  const categoryData = categoryDataFromApi?.data
    ?.filter((item) => categories.some((d) => d.value === item.name))
    .map(({ id, name }) => ({ id, name }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const collectionsData = collectionsDataFromApi?.data
    ?.filter((item) => collections.some((d) => d.value === item.name))
    .map(({ id, name }) => ({ id, name: name as string }))
    .slice(0, -1);

  return (
    <LayoutScreen statusBarColor={colors.primary} isNoPadding>
      <SearchSuggestionContainer>
        <Configure highlightPreTag="<mark>" highlightPostTag="</mark>" />
        <SearchBox from={route.params?.from || ''} />
        <EmptyQueryBoundary
          fallback={
            <View>
              <CategoriesList data={categoryData || []} from={route.params?.from || ''} />
              <RecommendedCollection data={collectionsData || []} from={route.params?.from || ''} />
            </View>
          }
        >
          <ScrollView showsVerticalScrollIndicator={false}>
            <Suggestions
              indexName={Config.ALGOLIA_INDEX_NAME_QUERY_SUGGESTIONS}
              hitComponent={({ hit }) => <Suggestion item={hit} refine={refine} />}
              ref={listRef}
            />
            <SearchResult data={categoryData || []} from={route.params?.from || ''} />
          </ScrollView>
        </EmptyQueryBoundary>
      </SearchSuggestionContainer>
    </LayoutScreen>
  );
};

const Suggestion = ({ item, refine }: { item: Hit; refine: (value: string) => void }) => {
  const navigation = useNavigation<SearchComponentStackProps>();
  const route = useRoute<SearchSuggestionRouteProps>();

  return (
    <TouchableOpacity
      onPress={() => {
        refine(item.title as string);
        navigation.navigate('SearchStack', {
          screen: 'Search',
          params: { query: item.title as string, from: route.params?.from || '' }
        });
      }}
    >
      <Text style={{ padding: 16 }}>
        <Highlight hit={item} attribute="title" />
      </Text>
    </TouchableOpacity>
  );
};
