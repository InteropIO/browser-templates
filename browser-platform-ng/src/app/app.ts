import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { IOConnectService } from './io-connect.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  private readonly ioConnectService = inject(IOConnectService);
  
  public ioConnectStatus = signal<"connected" | "disconnected">("disconnected");
  public ioConnectInitError = signal<string | undefined>(undefined);

  ngOnInit(): void {
    this.ioConnectStatus.set(this.ioConnectService.connectionStatus);

    if (this.ioConnectStatus() === "disconnected") {
        this.ioConnectInitError.set(this.ioConnectService.initError);
    }
  }

  apiVersion(): string {
    return this.ioConnectService.io.version || "N/A";
  }

  platformVersion(): string {
    return this.ioConnectService.io.webPlatform?.version || "N/A";
  }
}
