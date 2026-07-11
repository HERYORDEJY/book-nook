import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

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
                fillRule="evenodd"
                clipRule="evenodd"
                d="M17.04 15.624a9.004 9.004 0 10-1.415 1.415l5.667 5.668a1 1 0 001.415-1.415l-5.668-5.668zm-7.036 1.393a7.013 7.013 0 110-14.026 7.013 7.013 0 010 14.026z"
                fill={props.color ?? "#0F0F0F"}
            />
        </Svg>
    );
}

const SearchIcon = React.memo(SvgComponent);
export default SearchIcon;
