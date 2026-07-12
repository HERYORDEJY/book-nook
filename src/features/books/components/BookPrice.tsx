import React from "react";
import { StyleProp, TextStyle } from "react-native";
import CustomText from "~/components/CustomText";
import { FontType } from "~/styles/font";
import { formatAmountIntl } from "~/utils/amount-helpers";

interface Props {
    amount: number;
    fontSize?: number;
    fontFamily?: FontType;
    color?: string;
    style?: StyleProp<TextStyle>;
    testID?: string;
}

export default function BookPrice({
    amount,
    fontSize = 14,
    fontFamily = "medium",
    color,
    style,
    testID,
}: Props): React.JSX.Element {
    return (
        <CustomText
            testID={testID}
            fontSize={fontSize}
            fontFamily={fontFamily}
            color={color}
            numberOfLines={1}
            style={style}
        >
            {formatAmountIntl(amount)}
        </CustomText>
    );
}
