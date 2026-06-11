# Project Base Restructure Options

## Purpose

The user wants the final project to feel clean and centered on the new game, not surrounded by unrelated reference projects.

No restructure is being performed now. This file records the options.

## Option A: Keep New Game Under `projects/statistics-business-game`

Shape:

```text
repo-root/
  projects/statistics-business-game/
  docs/mentor-playbook/
  references/archive/
```

Pros:

* safest with current repo
* no need to move existing starter files immediately
* reference material can stay separate

Cons:

* game is nested
* publishing setup may need to point into subfolder

Best when:

* we want to preserve the current root starter for a while
* we are still in planning/discovery

## Option B: Promote New Game To Repo Root Later

Shape:

```text
repo-root/
  src/
  public/
  assets/
  docs/
  references/
  package.json
```

Pros:

* cleanest final publishing shape
* root clearly is the new game
* simpler for deployment later

Cons:

* requires careful migration plan
* existing root starter code must be replaced, moved, or archived later
* higher risk if done too early

Best when:

* game concept is decided
* implementation stack is chosen
* reference extraction is complete
* user approves cleanup

## Option C: Create A Separate Fresh Repo Later

Shape:

```text
statistics-business-game/
  src/
  public/
  docs/
  assets/
```

Pros:

* cleanest long-term separation
* reference repo can remain untouched
* avoids accidental legacy clutter

Cons:

* requires copy/export workflow later
* may split history/context

Best when:

* user wants a production-clean repo
* reference materials should remain private or separate

## Recommendation

For now, keep Option A.

After the Game Vision Workshop and first prototype plan, choose between Option B and Option C before building real game code.

Do not restructure now.
