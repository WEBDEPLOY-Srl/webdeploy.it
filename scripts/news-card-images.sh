#!/bin/sh
# SPDX-FileCopyrightText: 2026 WEBDEPLOY S.R.L.
# SPDX-License-Identifier: AGPL-3.0-only
# Regenerate the responsive /news crops from the shipped article masters.
set -eu
cd "$(dirname "$0")/../src/static"
work=$(mktemp -d)
trap 'rm -f "$work/crop.png"; rmdir "$work"' EXIT

encode_avif() {
	if [ "$image" = php2shell ]; then
		avifenc --codec aom --jobs 2 --speed 3 --yuv 444 "$@" "$work/crop.png" "$target.avif"
	else
		avifenc --codec aom --jobs 2 --speed 3 --yuv 420 --sharpyuv "$@" "$work/crop.png" "$target.avif"
	fi
}

for image in php2shell fosdem; do
	case "$image" in
		php2shell) original=news-php2shell.webp ;;
		fosdem) original=fosdem-2026.jpg ;;
	esac
	master_width=$(magick identify -ping -format '%w' "$original")
	for width in 400 592 672 800 "$master_width"; do
		[ "$width" -le "$master_width" ] || continue
		height=$(((width * 9 + 8) / 16))
		size="${width}x${height}"
		target="images/${image}-card-${width}"
		magick "$original" -auto-orient -colorspace sRGB -filter Lanczos \
			-resize "${size}^" -gravity center -extent "$size" -strip "PNG24:$work/crop.png"
		encode_avif --qcolor 80
		case "$image" in
			php2shell) magick "$work/crop.png" -define webp:method=6 -quality 90 "$target.webp" ;;
			fosdem) magick "$work/crop.png" -sampling-factor 4:2:0 -quality 90 "$target.jpg" ;;
		esac
	done
done
