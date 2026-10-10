"""Package app-only browser captures; does not operate or render a browser.

Optional media-maintenance tool. Requires Pillow, not a frontend dependency.
"""

import argparse
from pathlib import Path

from PIL import Image, ImageOps


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("captures", type=Path, help="Folder containing overview/operations/fleet/simulation/mobile.jpg and frame-*.jpg")
    parser.add_argument("--root", type=Path, default=Path(__file__).resolve().parents[1])
    options = parser.parse_args()
    captures = options.captures.resolve()
    root = options.root.resolve()
    media = root / "docs" / "media"
    public = root / "public"

    names = ["overview", "operations", "fleet", "simulation", "mobile"]
    inputs = [captures / f"{name}.jpg" for name in names]
    frames = sorted(captures.glob("frame-*.jpg"))
    if not all(item.is_file() for item in inputs) or len(frames) < 2:
        parser.error("Five named screenshots and at least two frame-*.jpg files are required.")
    if captures == media or captures == public:
        parser.error("Use a separate input folder so original captures remain intact.")

    # Validate every input before writing outputs.
    for item in inputs + frames:
        with Image.open(item) as image:
            image.verify()
    media.mkdir(parents=True, exist_ok=True)
    public.mkdir(parents=True, exist_ok=True)
    for name, source in zip(names, inputs):
        with Image.open(source) as image:
            output = image.convert("RGB")
            output.thumbnail((1440, 1440), Image.Resampling.LANCZOS)
            output.save(media / f"{name}.jpg", quality=90, optimize=True)

    with Image.open(inputs[0]) as image:
        social = ImageOps.fit(image.convert("RGB"), (1200, 630), method=Image.Resampling.LANCZOS, centering=(0.5, 0.3))
        social.save(public / "social-preview.jpg", quality=88, optimize=True)

    animation = []
    for source in frames:
        with Image.open(source) as image:
            frame = ImageOps.pad(image.convert("RGB"), (960, 640), method=Image.Resampling.LANCZOS, color="#06090d")
            animation.append(frame.quantize(colors=128, method=Image.Quantize.MEDIANCUT))
    durations = [2200] + [700] * (len(animation) - 2) + [2600]
    animation[0].save(media / "command-demo.gif", save_all=True, append_images=animation[1:], duration=durations, loop=0, optimize=True, disposal=2)

    for output in sorted(media.iterdir()) + [public / "social-preview.jpg"]:
        if output.is_file():
            print(f"{output.relative_to(root)}: {output.stat().st_size:,} bytes")


if __name__ == "__main__":
    main()
