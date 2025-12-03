import os
import shutil
import zipfile

# Create directories
dirs = [
    "VAYRO-Brand/Logo-Horizontal",
    "VAYRO-Brand/Logo-Square",
    "VAYRO-Brand/Logo-Monogram",
    "VAYRO-Brand/Favicon",
    "VAYRO-Brand/Brand-Guide"
]

for d in dirs:
    os.makedirs(d, exist_ok=True)

# Copy files
copy_map = {
    "assets/Concept 1/Horizontal Dark.png": "VAYRO-Brand/Logo-Horizontal/horizontal-dark.png",
    "assets/Concept 1/Horizontal light variant.png": "VAYRO-Brand/Logo-Horizontal/horizontal-light.png",
    "assets/Concept 1/Square Dark Version.png": "VAYRO-Brand/Logo-Square/square-dark.png",
    "assets/Concept 1/Square Light variant.png": "VAYRO-Brand/Logo-Square/square-light.png",
    "assets/Concept 1/Monogram V — Dark Variant.png": "VAYRO-Brand/Logo-Monogram/monogram-dark.png",
    "assets/Concept 1/Monogram V — Light Variant.png": "VAYRO-Brand/Logo-Monogram/monogram-light.png"
}

for src, dst in copy_map.items():
    if os.path.exists(src):
        shutil.copy2(src, dst)
    else:
        print(f"Warning: Source file not found: {src}")

# Move palette image (assuming it's in the artifacts dir, but I need to copy it from the absolute path provided in the previous step)
# Since I can't easily access the previous step's output path programmatically here without hardcoding, 
# I will assume the user or I will handle the palette image move separately or I'll skip it in this script 
# and handle it via a separate tool call if needed. 
# actually, I can just copy it if I know the path. 
# The path was: C:/Users/Adarshy YADAB/.gemini/antigravity/brain/f2701c7f-4fba-4d5c-acb9-e46bf4294fc9/brand_palette_1764325918942.png
# I'll add a try/except block for it.

palette_src = "C:/Users/Adarshy YADAB/.gemini/antigravity/brain/f2701c7f-4fba-4d5c-acb9-e46bf4294fc9/brand_palette_1764325918942.png"
palette_dst = "VAYRO-Brand/Brand-Guide/palette.png"
if os.path.exists(palette_src):
    shutil.copy2(palette_src, palette_dst)

print("File structure created.")

# Zip folder
shutil.make_archive("VAYRO-Brand", 'zip', "VAYRO-Brand")
print("VAYRO-Brand.zip created.")
