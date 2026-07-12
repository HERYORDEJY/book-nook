import React, { useCallback, useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import CustomScreenContainer from "~/components/CustomScreenContainer";
import CustomText from "~/components/CustomText";
import CustomTextInput from "~/components/CustomTextInput";
import CustomButton from "~/components/CustomButton";
import StackScreenNavBar from "~/components/StackScreenNavBar";
import { Styles } from "~/styles";
import { lightThemeColor } from "~/styles/color";
import { RootStackParamList } from "~/navigation/types";
import { useCartStore } from "~/features/cart/store/cartStore";
import {
    useCartItems,
    useCartTotalPrice,
} from "~/features/cart/store/selectors";
import { bookApiService } from "~/services/mock/api/book";
import { formatAmountIntl } from "~/utils/amount-helpers";

interface FormState {
    name: string;
    email: string;
    card: string;
    expiry: string;
    cvv: string;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

const EMAIL_REGEX = /^\S+@\S+\.\S+$/;

function validate(form: FormState): FormErrors {
    const errors: FormErrors = {};
    if (!form.name.trim()) errors.name = "Name is required";
    if (!EMAIL_REGEX.test(form.email)) errors.email = "Enter a valid email";
    if (form.card.replace(/\s/g, "").length < 12)
        errors.card = "Enter a valid card number";
    if (!/^\d{2}\/\d{2}$/.test(form.expiry)) errors.expiry = "MM/YY";
    if (!/^\d{3,4}$/.test(form.cvv)) errors.cvv = "3–4 digits";
    return errors;
}

export default function Checkout(): React.JSX.Element {
    const navigation =
        useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const items = useCartItems();
    const totalPrice = useCartTotalPrice();
    const clearCart = useCartStore((state) => state.clearCart);

    const [form, setForm] = useState<FormState>({
        name: "",
        email: "",
        card: "",
        expiry: "",
        cvv: "",
    });
    const [errors, setErrors] = useState<FormErrors>({});
    const [submitting, setSubmitting] = useState(false);

    const setField = useCallback(
        (key: keyof FormState) => (value: string) =>
            setForm((prev) => ({ ...prev, [key]: value })),
        [],
    );

    const handlePlaceOrder = useCallback(async () => {
        const nextErrors = validate(form);
        setErrors(nextErrors);
        if (Object.keys(nextErrors).length > 0) return;

        setSubmitting(true);
        try {
            const order = await bookApiService.checkout({
                customer: { name: form.name.trim(), email: form.email.trim() },
                items,
            });
            clearCart();
            Alert.alert("Order placed", `Order ${order.orderId} confirmed.`, [
                { text: "OK", onPress: () => navigation.goBack() },
            ]);
        } catch (error) {
            Alert.alert(
                "Checkout failed",
                error instanceof Error ? error.message : "Please try again.",
            );
        } finally {
            setSubmitting(false);
        }
    }, [form, items, clearCart, navigation]);

    return (
        <CustomScreenContainer edges={["bottom"]}>
            <StackScreenNavBar title={"Checkout"} />

            <KeyboardAvoidingView
                style={styles.flex}
                behavior={Platform.OS === "ios" ? "padding" : undefined}
            >
                <ScrollView
                    contentContainerStyle={styles.content}
                    keyboardShouldPersistTaps={"handled"}
                    showsVerticalScrollIndicator={false}
                >
                    <Field label={"Full name"} error={errors.name}>
                        <CustomTextInput
                            placeholder={"Jane Doe"}
                            value={form.name}
                            onChangeText={setField("name")}
                        />
                    </Field>

                    <Field label={"Email"} error={errors.email}>
                        <CustomTextInput
                            placeholder={"jane@example.com"}
                            value={form.email}
                            onChangeText={setField("email")}
                            keyboardType={"email-address"}
                            autoCapitalize={"none"}
                        />
                    </Field>

                    <Field label={"Card number"} error={errors.card}>
                        <CustomTextInput
                            placeholder={"1234 5678 9012 3456"}
                            value={form.card}
                            onChangeText={setField("card")}
                            keyboardType={"number-pad"}
                            maxLength={19}
                        />
                    </Field>

                    <View style={[Styles.row, styles.splitRow]}>
                        <Field
                            label={"Expiry"}
                            error={errors.expiry}
                            style={styles.flex}
                        >
                            <CustomTextInput
                                placeholder={"MM/YY"}
                                value={form.expiry}
                                onChangeText={setField("expiry")}
                                maxLength={5}
                            />
                        </Field>
                        <Field
                            label={"CVV"}
                            error={errors.cvv}
                            style={styles.flex}
                        >
                            <CustomTextInput
                                placeholder={"123"}
                                value={form.cvv}
                                onChangeText={setField("cvv")}
                                keyboardType={"number-pad"}
                                maxLength={4}
                            />
                        </Field>
                    </View>
                </ScrollView>

                <View style={styles.footer}>
                    <View style={[Styles.row, styles.totalRow]}>
                        <CustomText fontFamily={"medium"}>
                            Order total
                        </CustomText>
                        <CustomText fontFamily={"bold"} fontSize={18}>
                            {formatAmountIntl(totalPrice)}
                        </CustomText>
                    </View>

                    <CustomButton
                        onPress={handlePlaceOrder}
                        loading={submitting}
                        disabled={items.length === 0}
                    >
                        Place order
                    </CustomButton>
                </View>
            </KeyboardAvoidingView>
        </CustomScreenContainer>
    );
}

interface FieldProps {
    label: string;
    error?: string;
    style?: object;
    children: React.ReactNode;
}

function Field({ label, error, style, children }: FieldProps) {
    return (
        <View style={[styles.field, style]}>
            <CustomText fontSize={12} color={lightThemeColor.textSecondary}>
                {label}
            </CustomText>
            {children}
            {error ? (
                <CustomText fontSize={11} color={"#CC3333"}>
                    {error}
                </CustomText>
            ) : null}
        </View>
    );
}

const styles = StyleSheet.create({
    flex: {
        flex: 1,
    },
    content: {
        padding: 16,
        rowGap: 16,
    },
    field: {
        rowGap: 6,
    },
    splitRow: {
        columnGap: 12,
        alignItems: "flex-start",
    },
    footer: {
        padding: 16,
        rowGap: 16,
        borderTopWidth: 1,
        borderTopColor: "#EEEEEE",
    },
    totalRow: {
        justifyContent: "space-between",
    },
});
