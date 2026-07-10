import { SafeAreaProvider } from "react-native-safe-area-context";
import RootNavigator from "~/navigation/RootNavigator";
import { NavigationContainer } from "@react-navigation/native";
import { useFonts } from "expo-font";
import { useEffect } from "react";
import * as SplashScreen from "expo-splash-screen";

SplashScreen.preventAutoHideAsync();

export default function App() {
    const [loaded, error] = useFonts({
        GoogleSansBold: require("./src/assets/fonts/GoogleSans-Bold.ttf"),
        GoogleSansMedium: require("./src/assets/fonts/GoogleSans-Medium.ttf"),
        GoogleSansRegular: require("./src/assets/fonts/GoogleSans-Regular.ttf"),
    });

    useEffect(() => {
        if (loaded || error) {
            SplashScreen.hideAsync();
        }
    }, [loaded, error]);

    if (!loaded && !error) {
        return null;
    }

    return (
        <SafeAreaProvider>
            <NavigationContainer>
                <RootNavigator />
            </NavigationContainer>
        </SafeAreaProvider>
    );
}
