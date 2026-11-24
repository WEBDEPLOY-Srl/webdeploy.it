#!/bin/sh
# SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
# SPDX-License-Identifier: AGPL-3.0-only
# Regenerate responsive AVIF and WebP newsletter stamp images.
set -eu
cd "$(dirname "$0")/../src/static"
work=$(mktemp -d)
trap 'rm -f "$work/crop.png"; rmdir "$work"' EXIT

original=images/neon-cafe-workshop.webp
for width in 400 592 672 800 960; do
	height=$(((width * 9 + 8) / 16))
	size="${width}x${height}"
	target="images/neon-cafe-stamp-${width}"
	magick "$original" -auto-orient -colorspace sRGB -filter Lanczos \
		-resize "${size}^" -gravity center -extent "$size" -strip "PNG24:$work/crop.png"
	avifenc --codec aom --jobs 2 --speed 3 --yuv 420 --sharpyuv --qcolor 50 \
		"$work/crop.png" "$target.avif"
	magick "$work/crop.png" -define webp:method=6 -quality 90 "$target.webp"
done
