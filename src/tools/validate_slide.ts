import { z } from "zod";
import type { ToolResponse } from "../types/common.js";
import { createSuccessResponse } from "../utils/response.js";
import { checkSlideOverflow } from "../utils/validate.js";

export const validateSlideSchema = z.object({
  markdown: z.string().describe("Full Marp markdown text (including frontmatter)"),
});

export async function validateSlide(
  params: z.infer<typeof validateSlideSchema>
): Promise<ToolResponse> {
  const violations = checkSlideOverflow(params.markdown);

  if (violations.length === 0) {
    return createSuccessResponse({ valid: true, violations: [] });
  }

  const errorMessages = violations.map((v) =>
    v.type === "line_overflow"
      ? `スライド${v.slide_number}: 実質${v.line_count}行（上限${v.max_lines}行、${v.excess}行超過）`
      : `スライド${v.slide_number}: 表の横幅超過（${v.max_width}文字、上限${v.limit}文字）`
  );

  return createSuccessResponse({
    valid: false,
    violations,
    message: `オーバーフローを検出しました。修正してください。\n${errorMessages.join("\n")}`,
  });
}
