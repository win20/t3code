import { ClientSettingsSchema, DEFAULT_CLIENT_SETTINGS } from "@t3tools/contracts/settings";
import { Schema } from "effect";
import { describe, expect, it } from "vitest";

describe("ClientSettingsSchema", () => {
  it("defaults submitOnModEnter to false in the default client settings", () => {
    expect(DEFAULT_CLIENT_SETTINGS.submitOnModEnter).toBe(false);
  });

  it("defaults submitOnModEnter to false when missing from stored client settings", () => {
    expect(
      Schema.decodeSync(ClientSettingsSchema)({
        ...DEFAULT_CLIENT_SETTINGS,
        submitOnModEnter: undefined,
      }),
    ).toMatchObject({
      submitOnModEnter: false,
    });
  });
});
