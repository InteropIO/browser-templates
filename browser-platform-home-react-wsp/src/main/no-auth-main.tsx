import { IOConnectHome, IOConnectHomeConfig } from "@interopio/home-ui-react";
import { getIOConfig } from "../common/getIOConfig";
import { useMemo } from "react";

export const NoAuthMain = () => {
    const ioConnectHomeConfig: IOConnectHomeConfig = useMemo(
        () => ({
            getIOConnectConfig: getIOConfig,
        }),
        []
    );

    return <IOConnectHome config={ioConnectHomeConfig} />;
};
