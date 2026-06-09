from __future__ import annotations

import argparse
from pathlib import Path

import numpy as np
from PIL import Image, ImageDraw


def foreground_components(image: Image.Image, frame_count: int) -> list[tuple[int, int, int, int, int]]:
    arr = np.array(image.convert("RGBA"))
    mask = (arr[:, :, 3] > 0) & ~(
        (arr[:, :, 0] > 238) & (arr[:, :, 1] > 238) & (arr[:, :, 2] > 238)
    )
    height, width = mask.shape
    visited = np.zeros_like(mask, dtype=bool)
    components: list[tuple[int, int, int, int, int]] = []

    for y in range(height):
        xs = np.where(mask[y] & ~visited[y])[0]
        for x0 in xs:
            if visited[y, x0] or not mask[y, x0]:
                continue
            stack = [(int(x0), int(y))]
            visited[y, x0] = True
            min_x = max_x = int(x0)
            min_y = max_y = int(y)
            count = 0
            while stack:
                x, yy = stack.pop()
                count += 1
                min_x = min(min_x, x)
                max_x = max(max_x, x)
                min_y = min(min_y, yy)
                max_y = max(max_y, yy)
                for nx, ny in ((x + 1, yy), (x - 1, yy), (x, yy + 1), (x, yy - 1)):
                    if 0 <= nx < width and 0 <= ny < height and not visited[ny, nx] and mask[ny, nx]:
                        visited[ny, nx] = True
                        stack.append((nx, ny))
            if count > 1000:
                components.append((min_x, min_y, max_x, max_y, count))

    return sorted(sorted(components, key=lambda item: item[4], reverse=True)[:frame_count], key=lambda item: item[0])


def recover_strip(src: Path, out_dir: Path, prefix: str, frame_count: int, duration_ms: int) -> None:
    image = Image.open(src).convert("RGBA")
    components = foreground_components(image, frame_count)
    if len(components) != frame_count:
        raise ValueError(f"Expected {frame_count} components, found {len(components)}")

    pad = 18
    crops = []
    for min_x, min_y, max_x, max_y, _count in components:
        box = (
            max(0, min_x - pad),
            max(0, min_y - pad),
            min(image.width, max_x + pad + 1),
            min(image.height, max_y + pad + 1),
        )
        crops.append(image.crop(box))

    cell_w = max(crop.size[0] for crop in crops) + 40
    cell_h = max(crop.size[1] for crop in crops) + 40
    out_dir.mkdir(parents=True, exist_ok=True)
    frame_dir = out_dir / "recovered-frames"
    frame_dir.mkdir(exist_ok=True)

    frames: list[Image.Image] = []
    for index, crop in enumerate(crops, 1):
        frame = Image.new("RGBA", (cell_w, cell_h), (255, 255, 255, 255))
        x = (cell_w - crop.size[0]) // 2
        y = cell_h - crop.size[1] - 20
        frame.paste(crop, (x, y), crop)
        frame.save(frame_dir / f"{prefix}-recovered-frame-{index:02d}.png")
        frames.append(frame)

    strip = Image.new("RGBA", (cell_w * frame_count, cell_h), (255, 255, 255, 255))
    for index, frame in enumerate(frames):
        strip.paste(frame, (index * cell_w, 0), frame)
    strip.save(out_dir / f"{prefix}-recovered-fixedcells.png")

    gif_frames = [frame.convert("P", palette=Image.Palette.ADAPTIVE) for frame in frames]
    gif_frames[0].save(
        out_dir / f"preview-{prefix}-recovered.gif",
        save_all=True,
        append_images=gif_frames[1:],
        duration=duration_ms,
        loop=0,
        disposal=2,
    )

    review = Image.new("RGBA", (cell_w * 4 + 100, (cell_h + 40) * 2 + 80), (245, 245, 245, 255))
    draw = ImageDraw.Draw(review)
    for index, frame in enumerate(frames):
        row = index // 4
        col = index % 4
        x = 20 + col * (cell_w + 20)
        y = 20 + row * (cell_h + 60)
        draw.text((x, y), f"Frame {index + 1}", fill=(0, 0, 0, 255))
        review.paste(frame, (x, y + 30), frame)
        draw.rectangle((x, y + 30, x + cell_w - 1, y + 30 + cell_h - 1), outline=(0, 0, 0, 255), width=1)
    review.save(out_dir / f"{prefix}-frame-review.png")

    print(f"Recovered {frame_count} frames")
    print(f"Cell: {cell_w}x{cell_h}")
    print(f"Output: {out_dir}")


def main() -> None:
    parser = argparse.ArgumentParser(description="Recover fixed-cell frames from a generated horizontal pose strip.")
    parser.add_argument("--src", required=True, type=Path)
    parser.add_argument("--out-dir", required=True, type=Path)
    parser.add_argument("--prefix", required=True)
    parser.add_argument("--frames", type=int, default=8)
    parser.add_argument("--duration-ms", type=int, default=140)
    args = parser.parse_args()
    recover_strip(args.src, args.out_dir, args.prefix, args.frames, args.duration_ms)


if __name__ == "__main__":
    main()
