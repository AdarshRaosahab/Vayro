from PIL import Image
import os

source_path = "VAYRO-Brand/Logo-Monogram/monogram-dark.png"
output_dir = "VAYRO-Brand/Favicon"

if not os.path.exists(source_path):
    print(f"Source file not found: {source_path}")
    exit(1)

img = Image.open(source_path)

sizes = [16, 32, 48, 64, 128]

# Generate PNGs
for size in sizes:
    resized_img = img.resize((size, size), Image.Resampling.LANCZOS)
    resized_img.save(os.path.join(output_dir, f"{size}x{size}.png"))

# Generate ICO
img.save(os.path.join(output_dir, "favicon.ico"), format='ICO', sizes=[(32, 32)])

print("Favicons generated successfully.")
