/* eslint-disable @typescript-eslint/no-require-imports */

// Manual Reanimated mock — the shipped mock pulls in react-native-worklets'
// native module, which can't load under Jest. This covers the API surface the
// app uses (Animated.View, entering builders, shared values, worklet helpers).
jest.mock("react-native-reanimated", () => {
    const React = require("react");
    const { View } = require("react-native");

    const AnimatedView = React.forwardRef(
        (
            {
                entering,
                exiting,
                layout,
                sharedTransitionTag,
                sharedTransitionStyle,
                ...rest
            }: Record<string, unknown>,
            ref: unknown,
        ) => React.createElement(View, { ...rest, ref }),
    );
    AnimatedView.displayName = "AnimatedView";

    // Chainable no-op builder: FadeInDown.duration(x).delay(y) -> itself.
    const buildChainable = () =>
        new Proxy(function () {}, {
            get: () => () => buildChainable(),
            apply: () => buildChainable(),
        });

    return {
        __esModule: true,
        default: {
            View: AnimatedView,
            Text: AnimatedView,
            Image: AnimatedView,
            ScrollView: AnimatedView,
            createAnimatedComponent: (Component: unknown) => Component,
        },
        FadeIn: buildChainable(),
        FadeInDown: buildChainable(),
        FadeOut: buildChainable(),
        useSharedValue: (initial: unknown) => ({ value: initial }),
        useAnimatedStyle: (factory: () => unknown) => {
            try {
                return factory();
            } catch {
                return {};
            }
        },
        withTiming: (toValue: unknown, _config?: unknown, cb?: unknown) => {
            if (typeof cb === "function") cb(true);
            return toValue;
        },
        withSpring: (toValue: unknown, _config?: unknown, cb?: unknown) => {
            if (typeof cb === "function") cb(true);
            return toValue;
        },
        withSequence: (...values: unknown[]) => values[values.length - 1],
        withRepeat: (value: unknown) => value,
        runOnJS:
            (fn: (...args: unknown[]) => unknown) =>
            (...args: unknown[]) =>
                fn(...args),
        interpolate: (value: number, _input: number[], output?: number[]) =>
            output ? output[0] : value,
        cancelAnimation: () => {},
        Easing: new Proxy({}, { get: () => () => 0 }),
    };
});

// Native-backed views rendered as plain views so trees mount under Jest.
jest.mock("expo-image", () => {
    const { View } = require("react-native");
    return { Image: View };
});

jest.mock("expo-blur", () => {
    const { View } = require("react-native");
    return { BlurView: View };
});

jest.mock("expo-linear-gradient", () => {
    const { View } = require("react-native");
    return { LinearGradient: View };
});

// Safe-area context: passthrough provider/view and zero insets under Jest.
jest.mock("react-native-safe-area-context", () => {
    const React = require("react");
    const { View } = require("react-native");
    const insets = { top: 0, right: 0, bottom: 0, left: 0 };
    const frame = { x: 0, y: 0, width: 390, height: 844 };
    const SafeAreaView = React.forwardRef(
        ({ edges, ...rest }: Record<string, unknown>, ref: unknown) =>
            React.createElement(View, { ...rest, ref }),
    );
    SafeAreaView.displayName = "SafeAreaView";
    return {
        SafeAreaProvider: ({ children }: { children: unknown }) => children,
        SafeAreaView,
        useSafeAreaInsets: () => insets,
        useSafeAreaFrame: () => frame,
    };
});
