import * as NodeServices from "@effect/platform-node/NodeServices";
import { assert, describe, it } from "@effect/vitest";
import { ConfigProvider, Effect, Option } from "effect";

import { resolveBuildOptions, selectMacAppBundleRelativePath } from "./build-desktop-artifact.ts";

it.layer(NodeServices.layer)("build-desktop-artifact", (it) => {
  it.effect("preserves explicit false boolean flags over true env defaults", () =>
    Effect.gen(function* () {
      const resolved = yield* resolveBuildOptions({
        platform: Option.some("mac"),
        target: Option.none(),
        arch: Option.some("arm64"),
        productName: Option.none(),
        buildVersion: Option.none(),
        outputDir: Option.some("release-test"),
        skipBuild: Option.some(false),
        keepStage: Option.some(false),
        signed: Option.some(false),
        verbose: Option.some(false),
        mockUpdates: Option.some(false),
        mockUpdateServerPort: Option.none(),
      }).pipe(
        Effect.provide(
          ConfigProvider.layer(
            ConfigProvider.fromEnv({
              env: {
                T3CODE_DESKTOP_SKIP_BUILD: "true",
                T3CODE_DESKTOP_KEEP_STAGE: "true",
                T3CODE_DESKTOP_SIGNED: "true",
                T3CODE_DESKTOP_VERBOSE: "true",
                T3CODE_DESKTOP_MOCK_UPDATES: "true",
              },
            }),
          ),
        ),
      );

      assert.equal(resolved.skipBuild, false);
      assert.equal(resolved.keepStage, false);
      assert.equal(resolved.signed, false);
      assert.equal(resolved.verbose, false);
      assert.equal(resolved.mockUpdates, false);
    }),
  );
});

describe("build-desktop-artifact", () => {
  it("selects the named macOS app bundle from dir target output", () => {
    const relativePath = selectMacAppBundleRelativePath(
      [
        "builder-effective-config.yaml",
        "mac-arm64",
        "mac-arm64/T3 Code (Custom).app",
        "mac-arm64/T3 Code (Custom).app/Contents",
      ],
      "T3 Code (Custom)",
    );

    assert.equal(relativePath, "mac-arm64/T3 Code (Custom).app");
  });

  it("falls back to the only available app bundle when one exists", () => {
    const relativePath = selectMacAppBundleRelativePath(
      ["mac-arm64", "mac-arm64/T3 Code (Alpha).app"],
      "T3 Code (Custom)",
    );

    assert.equal(relativePath, "mac-arm64/T3 Code (Alpha).app");
  });

  it("rejects ambiguous dir target output when no bundle matches the requested name", () => {
    assert.throws(
      () =>
        selectMacAppBundleRelativePath(
          ["mac-arm64/T3 Code (Alpha).app", "mac-arm64/Another Build.app"],
          "T3 Code (Custom)",
        ),
      /Expected exactly one macOS \.app bundle/,
    );
  });
});
