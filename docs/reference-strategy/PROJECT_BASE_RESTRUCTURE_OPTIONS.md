# Project Base Restructure Options

## Purpose

The user wants the final project to feel clean and centered on the new statistics/business game, not surrounded by unrelated reference projects.

The root-project promotion has now been performed.

## Selected Direction: Root Project

Current shape:

```text
statistics-business-game/
  src/
  public/
  assets/
  docs/
  references/
  package.json
```

This is the active direction.

## Reference Placement

Imported reference projects now live under:

```text
references/imported-projects/
```

The previous nested workspace snapshot lives under:

```text
references/internal-workspace-snapshots/
```

These are retained for traceability and should not be copied as final game style.

## Optional Future Skill Location

If project-local skills become necessary:

```text
.codex/skills/
```

Do not add this unless a workflow is valuable, repeated, and not covered well by global skills.

## Future Alternatives

A separate fresh repo can still be created later if the user wants a production-clean export. That should happen after game vision and prototype plan are clear.

## Recommendation

Continue with the root project layout.

Do not build gameplay yet.

Do not create project-local skills yet unless the next real task proves a repeated workflow.
