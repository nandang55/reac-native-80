import { Text } from 'components/Text';
import { SizeGuideInterface, SizeGuideSectionInterface } from 'interfaces/ProductDetailInterface';
import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import colors from 'styles/colors';

const UserGuideComponents = ({
  data,
  onPressImage
}: {
  data: SizeGuideInterface | undefined;
  onPressImage: (values: string) => void;
}) => {
  return (
    <View style={[styles.container]}>
      <Text
        label={data?.main_title}
        variant="large"
        fontWeight="semi-bold"
        color={colors.dark.blackCoral}
      />
      <View style={[styles.itemsWrapper]}>
        {data?.sections.map((item, index) => {
          return <RenderItems key={index} item={item} onPress={onPressImage} />;
        })}
      </View>
    </View>
  );
};

const RenderItems = ({
  item,
  onPress
}: {
  item: SizeGuideSectionInterface;
  onPress: (values: string) => void;
}) => {
  return (
    <View style={styles.itemsSectionWrapper}>
      <Text
        label={item.title}
        color={colors.red.newPink3}
        fontWeight="semi-bold"
        variant="medium"
      />
      {item.description && (
        <Text
          label={item.description}
          color={colors.dark.blackCoral}
          fontWeight="regular"
          variant="medium"
        />
      )}
      {item.image && (
        <Pressable style={styles.itemImageContainer} onPress={() => onPress(item.image ?? '')}>
          <Image source={{ uri: item.image as string }} style={styles.itemImageContainer} />
        </Pressable>
      )}
      {item.list_items &&
        item.list_items.map((value, index) => {
          return (
            <RenderListItems
              key={index}
              items={value}
              index={index}
              onPress={(values) => onPress(values)}
            />
          );
        })}
    </View>
  );
};

const RenderListItems = ({
  items,
  index,
  onPress
}: {
  items: { text: string; image?: string };
  index: number;
  onPress: (values: string) => void;
}) => {
  return (
    <View style={styles.listItemsStyleWrapper}>
      <View style={styles.listChildrenStyleWrapper}>
        <View style={{ width: 25, alignItems: 'center' }}>
          <Text
            label={`${index + 1}. `}
            color={colors.dark.blackCoral}
            variant="medium"
            fontWeight="regular"
            textAlign="center"
          />
        </View>
        <Text
          label={items.text}
          color={colors.dark.blackCoral}
          variant="medium"
          fontWeight="regular"
          textAlign="justify"
        />
      </View>
      {items.image && (
        <Pressable style={styles.listItemImageContainer} onPress={() => onPress(items.image ?? '')}>
          <Image source={{ uri: items.image }} style={styles.listItemImageContainer} />
        </Pressable>
      )}
    </View>
  );
};

export default UserGuideComponents;

const styles = StyleSheet.create({
  container: {
    marginTop: 12,
    marginBottom: 16
  },
  itemsWrapper: {
    marginTop: 16,
    width: '100%',
    flexDirection: 'column',
    gap: 16
  },
  itemsSectionWrapper: {
    flexDirection: 'column',
    gap: 8
  },
  itemImageContainer: {
    width: '100%',
    height: 188,
    resizeMode: 'contain'
  },
  listItemsStyleWrapper: {
    flexDirection: 'column',
    gap: 8
  },
  listChildrenStyleWrapper: {
    flexDirection: 'row',
    gap: 4,
    width: '92%'
  },
  listItemImageContainer: {
    width: '100%',
    height: 355.32,
    resizeMode: 'contain'
  }
});
