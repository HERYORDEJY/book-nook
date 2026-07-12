import React from "react";
import { Pressable, StyleSheet, View, ViewStyle } from "react-native";
import CustomText from "~/components/CustomText";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RootStackParamList } from "~/navigation/types";
import ChevronLeftIcon from "~/components/svgs/ChevronLeftIcon";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { SvgProps } from "react-native-svg";

interface Props {
    title?: string;
    containerStyle?: ViewStyle;
    backButtonStyle?: ViewStyle;
    backButtonIconProps?: SvgProps;
    rightElement?: React.ReactNode;
}

export default function StackScreenNavBar(props: Props): React.JSX.Element {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const safeAreaInsets = useSafeAreaInsets();
    return (
        <View
            style={[
                styles.container,
                { paddingTop: safeAreaInsets.top },
                props.containerStyle,
            ]}
        >
            <View style={[styles.wrapper]}>
                <Pressable
                    testID={"stack-navbar-back-button"}
                    style={[styles.backButton, props.backButtonStyle]}
                    onPress={navigation.goBack}
                >
                    <ChevronLeftIcon {...props.backButtonIconProps} />
                </Pressable>
                {props.title ? (
                    <CustomText fontFamily={"medium"}>
                        {" "}
                        {props.title}
                    </CustomText>
                ) : null}

                <View style={[styles.backButton]}>{props.rightElement}</View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {},
    wrapper: {
        flexDirection: "row",
        height: 48,
        justifyContent: "space-between",
        alignItems: "center",
        width: "100%",
        paddingHorizontal: 16,
    },
    backButton: {
        width: 48,
        borderRadius: 48,
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
    },
});
