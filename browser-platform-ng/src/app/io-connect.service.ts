import { inject, Injectable } from "@angular/core";
import { IOConnectStore } from "@interopio/ng";
import { IOConnectBrowser } from "@interopio/browser";

@Injectable({ providedIn: 'root' })
export class IOConnectService {
    private readonly ioConnectStore = inject(IOConnectStore);

    get io(): IOConnectBrowser.API {
        return this.ioConnectStore.getIOConnect() as IOConnectBrowser.API;
    }
    
    get initError(): string | undefined {
        return typeof this.ioConnectStore.getInitError() === "string"
          ? this.ioConnectStore.getInitError() as string
          : JSON.stringify(this.ioConnectStore.getInitError(), null, 2);
    }
    
    get connectionStatus(): "disconnected" | "connected" {
        return this.initError ? "disconnected" : "connected";
    }
}