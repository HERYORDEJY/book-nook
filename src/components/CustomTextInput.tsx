import React from "react";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";
import CustomText from "~/components/CustomText";
import { Styles } from "~/styles";
import { GoogleSansFont } from "~/styles/font";

interface Props extends TextInputProps {
    label?: string;
    renderLeftElement?: React.ReactNode;
}

export default function CustomTextInput(props: Props): React.JSX.Element {
    return (
        <View style={styles.container}>
            {props.label ? <CustomText>{props.label}</CustomText> : null}

            <View style={[Styles.row, styles.textInputWrapper]}>
                {props.renderLeftElement}
                <TextInput {...props} style={styles.textInput} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        //
    },
    textInputWrapper: {
        borderWidth: 1,
        height: 46,
        borderRadius: 8,
        borderColor: "#CCCCCC",
        overflow: "hidden",
        columnGap: 12,
        paddingHorizontal: 12,
    },
    textInput: {
        fontSize: 14,
        fontFamily: GoogleSansFont.regular,
        flex: 1,
        height: "100%",
    },
});
