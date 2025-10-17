import React from 'react';
import { useInstantSearch } from 'react-instantsearch-core';
import { View } from 'react-native';

export const EmptyQueryBoundary = ({
  children,
  fallback
}: {
  children: React.ReactNode;
  fallback: React.ReactNode;
}) => {
  const { indexUiState } = useInstantSearch();

  if (!indexUiState.query) {
    return (
      <>
        {fallback}
        <View style={{ display: 'none' }}>{children}</View>
      </>
    );
  }

  return children;
};
