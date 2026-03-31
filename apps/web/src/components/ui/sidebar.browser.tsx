import "../../index.css";

import { page } from "vitest/browser";
import { afterEach, describe, expect, it, vi } from "vitest";
import { render } from "vitest-browser-react";

import { Sidebar, SidebarProvider, SidebarRail, SidebarTrigger } from "./sidebar";

interface MountedSidebarHarness {
  [Symbol.asyncDispose]: () => Promise<void>;
  cleanup: () => Promise<void>;
}

async function nextFrame(): Promise<void> {
  await new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => resolve());
  });
}

async function waitForLayout(): Promise<void> {
  await nextFrame();
  await nextFrame();
  await nextFrame();
}

async function setViewport(width: number, height: number): Promise<void> {
  await page.viewport(width, height);
  await waitForLayout();
}

async function mountSidebarHarness(options: { viewport: { width: number; height: number } }) {
  await setViewport(options.viewport.width, options.viewport.height);

  const host = document.createElement("div");
  host.style.position = "fixed";
  host.style.inset = "0";
  host.style.width = "100vw";
  host.style.height = "100vh";
  host.style.display = "grid";
  host.style.overflow = "hidden";
  document.body.append(host);

  const screen = await render(
    <SidebarProvider defaultOpen>
      <div className="flex min-h-full min-w-0">
        <Sidebar collapsible="offcanvas" side="left">
          <div className="p-4" data-testid="sidebar-body">
            Sidebar body
          </div>
          <SidebarRail />
        </Sidebar>
        <main className="flex min-w-0 flex-1 items-start gap-3 p-4">
          <SidebarTrigger />
          <span>Main content</span>
        </main>
      </div>
    </SidebarProvider>,
    { container: host },
  );

  await waitForLayout();

  const cleanup = async () => {
    await screen.unmount();
    host.remove();
  };

  return {
    [Symbol.asyncDispose]: cleanup,
    cleanup,
  } satisfies MountedSidebarHarness;
}

describe("Sidebar panel toggles", () => {
  afterEach(async () => {
    document.body.innerHTML = "";
    await setViewport(960, 800);
  });

  it("toggles the desktop sidebar without width or slide transition classes", async () => {
    await using _mounted = await mountSidebarHarness({ viewport: { width: 960, height: 800 } });

    const sidebarRoot = document.querySelector<HTMLElement>('[data-slot="sidebar"][data-state]');
    const sidebarGap = document.querySelector<HTMLElement>('[data-slot="sidebar-gap"]');
    const sidebarContainer = document.querySelector<HTMLElement>('[data-slot="sidebar-container"]');
    const sidebarRail = document.querySelector<HTMLButtonElement>('[data-slot="sidebar-rail"]');

    expect(sidebarRoot?.dataset.state).toBe("expanded");
    expect(sidebarGap?.className).not.toContain("transition-[width]");
    expect(sidebarContainer?.className).not.toContain("transition-[left,right,width]");
    expect(sidebarRail).toBeTruthy();

    sidebarRail?.click();

    await vi.waitFor(
      () => {
        expect(sidebarRoot?.dataset.state).toBe("collapsed");
      },
      { timeout: 8_000, interval: 16 },
    );

    sidebarRail?.click();

    await vi.waitFor(
      () => {
        expect(sidebarRoot?.dataset.state).toBe("expanded");
      },
      { timeout: 8_000, interval: 16 },
    );
  });
});
