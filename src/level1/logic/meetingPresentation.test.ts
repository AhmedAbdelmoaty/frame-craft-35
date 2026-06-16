import assert from "node:assert/strict";
import test from "node:test";

import { buildMeetingPresentation } from "./meetingPresentation.ts";

test("buildMeetingPresentation creates a success report and ordered dialogue for a strong midan recommendation", () => {
  const presentation = buildMeetingPresentation("midan", ["threshold", "median"]);

  assert.ok(presentation);
  assert.equal(presentation.report.recommendedBranchName, "فرع الميدان");
  assert.equal(presentation.report.evidenceItems.length, 2);
  assert.equal(presentation.evaluation.outcome, "success");
  assert.deepEqual(
    presentation.dialogue.map((line) => line.speaker),
    ["player", "nader", "layla", "emad"],
  );
});

test("buildMeetingPresentation creates a failure dialogue when the prepared recommendation picks corniche", () => {
  const presentation = buildMeetingPresentation("corniche", ["sales_summary", "hr_policy"]);

  assert.ok(presentation);
  assert.equal(presentation.report.recommendedBranchName, "فرع الكورنيش");
  assert.equal(presentation.evaluation.failureReason, "chose_corniche");
  assert.match(presentation.dialogue[1]?.text ?? "", /لا أستطيع اعتماد توصية/u);
});

test("buildMeetingPresentation returns null for incomplete recommendations", () => {
  assert.equal(buildMeetingPresentation(null, []), null);
  assert.equal(buildMeetingPresentation("midan", ["threshold"]), null);
});
