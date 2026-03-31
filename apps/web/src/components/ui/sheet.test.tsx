import { describe, expect, it } from "vitest";

import { getSheetBackdropClassName, getSheetPopupClassName } from "./sheet.logic";

describe("sheet animation classes", () => {
  it("keeps popup and backdrop transition classes by default", () => {
    const popupClassName = getSheetPopupClassName();
    const backdropClassName = getSheetBackdropClassName();

    expect(popupClassName).toContain("transition-[opacity,translate]");
    expect(popupClassName).toContain("data-ending-style:translate-x-8");
    expect(popupClassName).toContain("data-starting-style:translate-x-8");
    expect(popupClassName).toContain("w-[calc(100%-(--spacing(12)))]");
    expect(popupClassName).toContain("max-w-md");

    expect(backdropClassName).toContain("transition-all");
    expect(backdropClassName).toContain("data-ending-style:opacity-0");
    expect(backdropClassName).toContain("data-starting-style:opacity-0");
    expect(backdropClassName).toContain("bg-black/32");
  });

  it("omits popup and backdrop transition classes when animated is false", () => {
    const popupClassName = getSheetPopupClassName({ animated: false });
    const backdropClassName = getSheetBackdropClassName({ animated: false });

    expect(popupClassName).toContain("w-[calc(100%-(--spacing(12)))]");
    expect(popupClassName).toContain("max-w-md");
    expect(popupClassName).not.toContain("transition-[opacity,translate]");
    expect(popupClassName).not.toContain("duration-200");
    expect(popupClassName).not.toContain("will-change-transform");
    expect(popupClassName).not.toContain("data-ending-style:opacity-0");
    expect(popupClassName).not.toContain("data-starting-style:opacity-0");
    expect(popupClassName).not.toContain("data-ending-style:translate-x-8");
    expect(popupClassName).not.toContain("data-starting-style:translate-x-8");

    expect(backdropClassName).toContain("bg-black/32");
    expect(backdropClassName).not.toContain("transition-all");
    expect(backdropClassName).not.toContain("duration-200");
    expect(backdropClassName).not.toContain("data-ending-style:opacity-0");
    expect(backdropClassName).not.toContain("data-starting-style:opacity-0");
  });
});
