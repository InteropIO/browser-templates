import { inject, Injectable } from "@angular/core";
import { IOConnectStore } from "@interopio/ng";

type IOConnectApi = ReturnType<IOConnectStore["getIOConnect"]> & {
    webPlatform?: {
        version?: string;
    };
};

@Injectable({ providedIn: 'root' })
export class IOConnectService {
    private readonly ioConnectStore = inject(IOConnectStore);

    get io(): IOConnectApi {
        return this.ioConnectStore.getIOConnect() as IOConnectApi;
    }
    
    get initError(): string | undefined {
        return this.ioConnectStore.getInitError();
    }
    
    get connectionStatus(): "disconnected" | "connected" {
        return this.initError ? "disconnected" : "connected";
    }
}
