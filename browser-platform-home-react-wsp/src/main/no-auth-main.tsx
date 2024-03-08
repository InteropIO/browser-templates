import { IOConnectHome, IOConnectHomeConfig } from "@interopio/home-ui-react";
import { getIoConfig } from "../common/getIoConfig";
import { useMemo } from "react";

export const NoAuthMain = () => {
    const ioConnectHomeConfig: IOConnectHomeConfig = useMemo(
        () => ({
            ioConnectConfig: getIoConfig(),
        }),
        []
    );

    return <IOConnectHome config={ioConnectHomeConfig} />;
};
