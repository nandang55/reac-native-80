import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { CollectionCard } from 'components/Card';
import { LayoutScreen } from 'components/layouts';
import { Skeleton } from 'components/Skeleton';
import useGetCollections from 'hooks/useGetCollections';
import { BannerInterface } from 'interfaces/ProductInterface';
import { RootStackParamList } from 'navigators/RootStackNavigator';
import React, { useEffect } from 'react';
import { BackHandler, Dimensions, FlatList, View } from 'react-native';
import { RefreshControl } from 'react-native-gesture-handler';
import styled from 'styled-components';
import colors from 'styles/colors';

type LatestCollectionsNavigatorProps = StackNavigationProp<RootStackParamList>;

const { width } = Dimensions.get('screen');

const LatesCollectionsContainer = styled(View)`
  align-items: center;
  background-color: ${colors.light.whiteSolid};
  flex: 1;
`;

const LatestCollections = () => {
  const navigation = useNavigation<LatestCollectionsNavigatorProps>();

  const {
    data: dataCollections,
    isLoading: loadingCollections,
    isFetching: fetchingCollections,
    refetch: refetchCollections
  } = useGetCollections({});

  useEffect(() => {
    const backAction = () => {
      navigation.goBack();
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleOnDetailBanner = ({ title, id }: { id: string; title: string }) => {
    navigation.navigate('HomeStack', { screen: 'CollectionCatalogue', params: { id, title } });
  };

  const renderItem = ({ item }: { item: BannerInterface }) => {
    return loadingCollections || fetchingCollections ? (
      <View style={{ gap: 12, width: width, paddingHorizontal: 16, paddingVertical: 8 }}>
        <Skeleton width={width / 2} height={15} style={{ borderRadius: 2 }} />
        <Skeleton width={width - 32} height={150} style={{ borderRadius: 2 }} />
      </View>
    ) : (
      <CollectionCard {...item} onPress={handleOnDetailBanner} />
    );
  };

  return (
    <LayoutScreen isNoPadding>
      <LatesCollectionsContainer>
        <FlatList
          data={dataCollections?.data || []}
          renderItem={renderItem}
          keyExtractor={(_, index) => index.toString()}
          contentContainerStyle={{
            flexGrow: 1,
            gap: 8,
            paddingBottom: 20
          }}
          showsVerticalScrollIndicator={false}
          extraData={dataCollections}
          refreshControl={<RefreshControl onRefresh={refetchCollections} refreshing={false} />}
        />
      </LatesCollectionsContainer>
    </LayoutScreen>
  );
};

export default LatestCollections;
