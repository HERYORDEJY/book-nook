import * as React from "react";
import Svg, { Path, SvgProps } from "react-native-svg";

type Props = SvgProps;

function SvgComponent(props: Props) {
    return (
        <Svg
            width={26}
            height={26}
            viewBox="-0.799999999999983 -0.7999999999999758 25.599999999999994 25.6"
            {...props}
        >
            <Path
                d="M2.665-9.296a.75.75 0 011.006.336l2.201 4.402c1.353.104 2.202.37 2.75 1.047.9 1.114.541 2.79-.177 6.143l-.429 2c-.487 2.273-.73 3.41-1.555 4.076-.825.667-1.987.667-4.311.667h-4.3c-2.324 0-3.486 0-4.31-.667-.826-.667-1.07-1.803-1.556-4.076l-.429-2C-9.163-.72-9.523-2.397-8.622-3.51c.548-.678 1.397-.943 2.75-1.047l2.201-4.402a.75.75 0 011.342.67l-1.835 3.67c.483-.005 1.01-.005 1.586-.005h5.156c.576 0 1.103 0 1.586.005L2.33-8.29a.75.75 0 01.336-1.006zM-4.75.375A.75.75 0 01-4-.375h8a.75.75 0 010 1.5h-8a.75.75 0 01-.75-.75zM-2 2.625a.75.75 0 000 1.5h4a.75.75 0 000-1.5h-4z"
                transform="matrix(1.22194 0 0 1.19493 12 12)"
                data-editor-group="true"
                fill={props.color ?? "#1C274C"}
                fillRule="evenodd"
            />
        </Svg>
    );
}

const CartTabIcon = React.memo(SvgComponent);
export default CartTabIcon;
