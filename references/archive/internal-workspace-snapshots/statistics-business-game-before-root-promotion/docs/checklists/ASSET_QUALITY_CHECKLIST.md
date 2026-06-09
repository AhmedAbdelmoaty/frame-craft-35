# Asset Quality Checklist

Use this before accepting generated images, spritesheets, or animations.

## Images

Check:

* role/purpose is clear
* silhouette is readable
* style does not copy reference projects
* background is removable
* no fake transparency checkerboard
* no unwanted text
* no temporary effects in anchors
* image is large enough for cleanup

## Transparency

Check:

* true alpha or clean chroma key
* no green/magenta fragments after removal
* no halo or fringe around character
* no checkerboard pixels baked into image

## Spritesheets

Check:

* exact frame width
* exact frame height
* rows and columns
* frame count
* frame rate
* correct animation name
* no row bleed
* no column bleed
* no cropped body parts
* enough padding for gestures

## Animations

Check:

* identity consistent across frames
* body scale stable
* feet/body anchored
* no frame drift
* no unnecessary duplicate frames
* motion reads clearly
* loop starts and ends cleanly when needed
* action frames are not sluggish

## Frame Recovery

Check:

* generated sheets were not naively grid-cropped
* foreground components were recovered
* recovered frames were reviewed before final packing
* bad frames were regenerated or removed

## In-Game Preview

Check:

* asset loads
* no console errors
* animation plays at expected speed
* character does not float or sink
* UI/background does not obscure important content
* screenshot matches expected result

## Asset Index

Check:

* path is correct
* metadata is current
* frame dimensions are exact
* animation ranges are correct
* notes mention padding or empty frames if relevant
