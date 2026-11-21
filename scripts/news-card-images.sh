#!/bin/sh
# SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
# SPDX-License-Identifier: AGPL-3.0-only
# Regenerate the responsive /news crops from the shipped article masters.
set -eu
cd "$(dirname "$0")/../src/static"
work=$(mktemp -d)
trap 'rm -f "$work/crop.png"; rmdir "$work"' EXIT

encode_avif() {
	avifenc --codec aom --jobs 2 --speed 3 --yuv 420 --sharpyuv \
		"$@" "$work/crop.png" "$target.avif"
}

for image in php2shell fosdem; do
	case "$image" in
		php2shell) original=news-php2shell.webp ;;
		fosdem) original=fosdem-2026.jpg ;;
	esac
	for width in 400 592 672 800 1088 1184 1440; do
		height=$((width * 9 / 16))
		size="${width}x${height}"
		target="images/${image}-card-${width}"
		magick "$original" -auto-orient -colorspace sRGB -filter Lanczos \
			-resize "${size}^" -gravity center -extent "$size" -strip "PNG24:$work/crop.png"
		encode_avif --qcolor 58
		# Bound first-paint transfer for compact cards. Already-small images keep full quality.
		if [ "$width" -le 672 ] && [ "$(wc -c < "$target.avif")" -gt 32768 ]; then
			encode_avif --target-size 32768
		fi
		case "$image" in
			php2shell) magick "$work/crop.png" -define webp:method=6 -quality 86 "$target.webp" ;;
			fosdem) magick "$work/crop.png" -sampling-factor 4:2:0 -quality 86 "$target.jpg" ;;
		esac
	done
done
