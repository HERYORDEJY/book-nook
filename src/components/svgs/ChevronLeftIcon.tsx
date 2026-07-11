import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";
import { lightThemeColor } from "~/styles/color";

type Props = SvgProps;

function SvgComponent(props: Props) {
    return (
        <Svg
            width="24px"
            height="24px"
            viewBox="0 0 24 24"
            fill="none"
            {...props}
        >
            <Path
                d="M15 19l-5.16-5a2.75 2.75 0 010-4L15 5"
                stroke={props.color ?? lightThemeColor.bottomTabActive}
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
}

const ChevronLeftIcon = React.memo(SvgComponent);
export default ChevronLeftIcon;
