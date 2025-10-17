import { Hit as AlgoliaHit } from 'algoliasearch/lite';
import React, { forwardRef } from 'react';
import { Configure, Index, useHits } from 'react-instantsearch-core';
import { FlatList, StyleProp, View, ViewStyle } from 'react-native';
import styled from 'styled-components/native';
import colors from 'styles/colors';

interface ListInterface {
  hitComponent: React.ComponentType<{
    hit: AlgoliaHit;
  }>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

interface SuggestionsInterface extends ListInterface {
  indexName: string;
}

const Border = styled(View)<{ color?: string }>`
  border: 0.6px solid ${(props) => props.color || colors.dark.silver};
`;

export const Suggestions = forwardRef<FlatList, SuggestionsInterface>(
  ({ hitComponent: Hit, contentContainerStyle, indexName }, ref) => {
    return (
      <View>
        <Index indexName={indexName}>
          <Configure hitsPerPage={10} />
          <List hitComponent={Hit} ref={ref} contentContainerStyle={contentContainerStyle} />
        </Index>
      </View>
    );
  }
);

const List = forwardRef<FlatList, ListInterface>(
  ({ hitComponent: Hit, contentContainerStyle }, ref) => {
    const { items } = useHits();

    return (
      <FlatList
        ref={ref}
        data={items}
        scrollEnabled={false}
        keyExtractor={(item) => item.objectID}
        ItemSeparatorComponent={() => <Border color={colors.dark.solitude} />}
        renderItem={({ item }) => <Hit hit={item} />}
        contentContainerStyle={contentContainerStyle}
        keyboardShouldPersistTaps={'always'}
      />
    );
  }
);

Suggestions.displayName = 'Suggestions';
List.displayName = 'List';
