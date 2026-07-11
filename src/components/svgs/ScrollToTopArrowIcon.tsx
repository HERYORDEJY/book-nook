import * as React from "react";
import Svg, { G, Path, SvgProps } from "react-native-svg";

type Props = SvgProps;

function SvgComponent(props: Props) {
    return (
        <Svg
            width="64px"
            height="64px"
            viewBox="0 0 16 16"
            fill="none"
            {...props}
        >
            <G fill={props.color ?? "#000"}>
                <Path d="M13 9h-3v7H6V9H3V8l5-5 5 5v1zM14 2H2V0h12v2z" />
            </G>
        </Svg>
    );
}

const ScrollToTopArrowIcon = React.memo(SvgComponent);
export default ScrollToTopArrowIcon;
