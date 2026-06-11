# Decision 0001: Clean Root Workspace

## Decision

The repository root is now the clean workspace for the new statistics/business game.

The previous root Phaser starter has been preserved as a reference project under:

```text
references/imported-projects/root-phaser-starter/
```

The imported reference projects are preserved under:

```text
references/imported-projects/
```

## Rationale

The new game should not be nested inside `projects/statistics-business-game`, and it should not inherit the old starter game's identity as its base.

The project root should contain only:

* future source code
* future runtime public files
* new-game assets
* customized knowledge docs
* references
* package metadata

## Consequences

* No gameplay is implemented yet.
* The old starter is still available as reference.
* The root project is ready for game vision and planning.
* Project-local skills should only be added after a workflow proves repeated and valuable.
