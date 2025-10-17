import { Hit } from 'algoliasearch';
import { Text } from 'components/Text';
import { getHighlightedParts, getPropertyByPath } from 'instantsearch.js/es/lib/utils';
import React, { Fragment } from 'react';
import colors from 'styles/colors';

interface HighlightInterface {
  hit: Hit;
  attribute: string;
  separator?: string;
}

const HighlightPart = ({ label, isHighlighted }: { label: string; isHighlighted: boolean }) => {
  return (
    <Text
      label={label}
      fontWeight={isHighlighted ? 'bold' : 'regular'}
      color={colors.dark.blackCoral}
    />
  );
};

export const Highlight: React.FC<HighlightInterface> = ({ hit, attribute, separator = ', ' }) => {
  const { value: attributeValue = '' } = getPropertyByPath(hit._highlightResult, attribute) || {};
  const parts = getHighlightedParts(attributeValue);

  return (
    <>
      {parts.map((part, partIndex) => {
        if (Array.isArray(part)) {
          const isLastPart = partIndex === parts.length - 1;

          return (
            <Fragment key={partIndex}>
              {part.map((subPart, subPartIndex) => (
                <HighlightPart
                  key={subPartIndex}
                  isHighlighted={subPart.isHighlighted}
                  label={subPart.value}
                />
              ))}

              {!isLastPart && separator}
            </Fragment>
          );
        }

        return (
          <HighlightPart key={partIndex} isHighlighted={part.isHighlighted} label={part.value} />
        );
      })}
    </>
  );
};
