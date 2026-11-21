import os
import sys
import numpy as np
from PIL import Image, ImageDraw, ImageFilter, ImageEnhance, ImageFont

# Set UTF-8 output
sys.stdout.reconfigure(encoding='utf-8')

def get_font(name, size):
    try:
        return ImageFont.truetype(f'C:/Windows/Fonts/{name}', size)
    except Exception:
        return ImageFont.load_default()

def find_coeffs(pa, pb):
    matrix = []
    for p1, p2 in zip(pa, pb):
        matrix.append([p1[0], p1[1], 1, 0, 0, 0, -p2[0]*p1[0], -p2[0]*p1[1]])
        matrix.append([0, 0, 0, p1[0], p1[1], 1, -p2[1]*p1[0], -p2[1]*p1[1]])
    A = np.matrix(matrix, dtype=float)
    B = np.array(pb).reshape(8)
    res = np.dot(np.linalg.inv(A.T * A) * A.T, B)
    return np.array(res).reshape(8)

products = [
    {
        'num': '01',
        'filename': '01_srirangam_degree_coffee_250g_250.jpg',
        'title': 'Srirangam Degree Coffee',
        'texture': 'srirangam_cream',
        'weight': '250g',
        'price': '₹250',
        'is_500g': False,
        'tagline': 'Traditional South Indian Filter Coffee  •  Srirangam Heritage'
    },
    {
        'num': '02',
        'filename': '02_kumbakonam_degree_coffee_250g_250.jpg',
        'title': 'Kumbakonam Degree Coffee',
        'texture': 'kumbakonam_cream',
        'weight': '250g',
        'price': '₹250',
        'is_500g': False,
        'tagline': 'Double Roasted Beans  •  Strong Aroma  •  Kumbakonam Heritage'
    },
    {
        'num': '03',
        'filename': '03_srirangam_premium_blend_250g_300.jpg',
        'title': 'Srirangam Premium Blend',
        'texture': 'srirangam_maroon',
        'weight': '250g',
        'price': '₹300',
        'is_500g': False,
        'tagline': 'A Legacy of Purity & Richness  •  Slow Roasted Beans'
    },
    {
        'num': '04',
        'filename': '04_kumbakonam_premium_blend_250g_300.jpg',
        'title': 'Kumbakonam Premium Blend',
        'texture': 'kumbakonam_dark',
        'weight': '250g',
        'price': '₹300',
        'is_500g': False,
        'tagline': 'A Legacy of Purity & Richness  •  Export Quality Beans'
    },
    {
        'num': '05',
        'filename': '05_srirangam_degree_coffee_500g_500.jpg',
        'title': 'Srirangam Degree Coffee',
        'texture': 'srirangam_cream',
        'weight': '500g',
        'price': '₹500',
        'is_500g': True,
        'tagline': 'Traditional South Indian Filter Coffee  •  Srirangam Heritage'
    },
    {
        'num': '06',
        'filename': '06_kumbakonam_degree_coffee_500g_500.jpg',
        'title': 'Kumbakonam Degree Coffee',
        'texture': 'kumbakonam_cream',
        'weight': '500g',
        'price': '₹500',
        'is_500g': True,
        'tagline': 'Double Roasted Beans  •  Strong Aroma  •  Kumbakonam Heritage'
    },
    {
        'num': '07',
        'filename': '07_srirangam_premium_blend_500g_600.jpg',
        'title': 'Srirangam Premium Blend',
        'texture': 'srirangam_maroon',
        'weight': '500g',
        'price': '₹600',
        'is_500g': True,
        'tagline': 'A Legacy of Purity & Richness  •  Slow Roasted Beans'
    },
    {
        'num': '08',
        'filename': '08_kumbakonam_premium_blend_500g_600.jpg',
        'title': 'Kumbakonam Premium Blend',
        'texture': 'kumbakonam_dark',
        'weight': '500g',
        'price': '₹600',
        'is_500g': True,
        'tagline': 'A Legacy of Purity & Richness  •  Export Quality Beans'
    }
]

def render_product(p, out_dir='assets/products_8'):
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, p['filename'])
    size = (1200, 1200)
    canvas = Image.new('RGB', size, (253, 251, 247))
    draw = ImageDraw.Draw(canvas)
    
    # 1. Subtle warm studio gradient background
    for y in range(size[1]):
        r = int(255 - (y / size[1]) * 10)
        g = int(253 - (y / size[1]) * 12)
        b = int(249 - (y / size[1]) * 15)
        draw.line([(0, y), (size[0], y)], fill=(r, g, b))
        
    # Soft warm spotlight under box
    spot = Image.new('RGBA', size, (0, 0, 0, 0))
    s_draw = ImageDraw.Draw(spot)
    if not p['is_500g']:
        s_draw.ellipse([150, 720, 1050, 1080], fill=(238, 230, 218, 140))
    else:
        s_draw.ellipse([100, 740, 1100, 1120], fill=(238, 230, 218, 150))
    spot = spot.filter(ImageFilter.GaussianBlur(90))
    canvas.paste(spot, (0, 0), spot)
    
    # 2. Coordinates for 3D box
    if not p['is_500g']:
        # 250g: Sleek, compact single pack
        p0 = (370, 310)
        p1 = (730, 270)
        p2 = (730, 780)
        p3 = (370, 820)
        p4 = (840, 230)
        p5 = (840, 740)
        p6 = (480, 270)
    else:
        # 500g: Visibly larger, wider, deeper, taller family pack
        p0 = (320, 290)
        p1 = (750, 240)
        p2 = (750, 820)
        p3 = (320, 870)
        p4 = (890, 190)
        p5 = (890, 770)
        p6 = (460, 240)
        
    # 3. Floor Drop Shadow & Contact Shadow
    shadow_layer = Image.new('RGBA', size, (0, 0, 0, 0))
    sh_draw = ImageDraw.Draw(shadow_layer)
    
    amb_poly = [
        (p3[0] - 40, p3[1] + 15),
        (p2[0] + 15, p2[1] + 15),
        (p5[0] + 80, p5[1] + 15),
        (p5[0] + 120, p5[1] + 80),
        (p3[0] - 30, p3[1] + 80)
    ]
    sh_draw.polygon(amb_poly, fill=(20, 15, 10, 110))
    shadow_layer = shadow_layer.filter(ImageFilter.GaussianBlur(35))
    canvas.paste(shadow_layer, (0, 0), shadow_layer)
    
    contact_layer = Image.new('RGBA', size, (0, 0, 0, 0))
    c_draw = ImageDraw.Draw(contact_layer)
    c_poly = [
        (p3[0] - 10, p3[1] + 2),
        (p2[0] + 5, p2[1] + 2),
        (p5[0] + 15, p5[1] + 2),
        (p5[0] + 20, p5[1] + 18),
        (p3[0] - 5, p3[1] + 20)
    ]
    c_draw.polygon(c_poly, fill=(15, 10, 8, 180))
    contact_layer = contact_layer.filter(ImageFilter.GaussianBlur(10))
    canvas.paste(contact_layer, (0, 0), contact_layer)
    
    # 4. Load textures (100% UNTOUCHED ORIGINAL ARTWORK)
    front_img = Image.open(f"assets/textures/{p['texture']}/front.jpg").convert('RGBA')
    side_img = Image.open(f"assets/textures/{p['texture']}/side_left.jpg").convert('RGBA')
    top_img = Image.open(f"assets/textures/{p['texture']}/top.jpg").convert('RGBA')
    
    # 5. Warp Top face
    coeffs_top = find_coeffs([p6, p4, p1, p0], [(0, 0), (top_img.width, 0), (top_img.width, top_img.height), (0, top_img.height)])
    warped_top = top_img.transform(size, Image.PERSPECTIVE, coeffs_top, Image.BICUBIC)
    top_bright = ImageEnhance.Brightness(warped_top).enhance(1.08)
    mask_top = Image.new('L', size, 0)
    ImageDraw.Draw(mask_top).polygon([p6, p4, p1, p0], fill=255)
    canvas.paste(top_bright, (0, 0), mask_top)
    
    # 6. Warp Side face
    coeffs_side = find_coeffs([p1, p4, p5, p2], [(0, 0), (side_img.width, 0), (side_img.width, side_img.height), (0, side_img.height)])
    warped_side = side_img.transform(size, Image.PERSPECTIVE, coeffs_side, Image.BICUBIC)
    side_dark = ImageEnhance.Brightness(warped_side).enhance(0.80)
    mask_side = Image.new('L', size, 0)
    ImageDraw.Draw(mask_side).polygon([p1, p4, p5, p2], fill=255)
    canvas.paste(side_dark, (0, 0), mask_side)
    
    # 7. Warp Front face
    coeffs_front = find_coeffs([p0, p1, p2, p3], [(0, 0), (front_img.width, 0), (front_img.width, front_img.height), (0, front_img.height)])
    warped_front = front_img.transform(size, Image.PERSPECTIVE, coeffs_front, Image.BICUBIC)
    front_bright = ImageEnhance.Brightness(warped_front).enhance(1.02)
    mask_front = Image.new('L', size, 0)
    ImageDraw.Draw(mask_front).polygon([p0, p1, p2, p3], fill=255)
    canvas.paste(front_bright, (0, 0), mask_front)
    
    # 8. Subtle gold edge highlights on the 3D box corners
    edges = Image.new('RGBA', size, (0, 0, 0, 0))
    e_draw = ImageDraw.Draw(edges)
    e_draw.line([p0, p1, p2], fill=(255, 240, 200, 90), width=1)
    e_draw.line([p0, p3], fill=(255, 240, 200, 60), width=1)
    e_draw.line([p1, p4], fill=(255, 240, 200, 80), width=1)
    canvas.paste(edges, (0, 0), edges)
    
    # 9. Luxury Studio E-Commerce Presentation Overlay
    # Top Left: Brand & Product Header
    f_brand = get_font('georgiab.ttf', 20)
    f_title = get_font('georgiab.ttf', 34)
    f_sub = get_font('georgia.ttf', 16)
    
    draw.text((60, 50), 'TEMPLEBREW', font=f_brand, fill=(201, 154, 67))
    draw.line([(60, 78), (220, 78)], fill=(201, 154, 67), width=2)
    draw.text((60, 88), p['title'].upper(), font=f_title, fill=(23, 9, 5))
    draw.text((60, 130), p['tagline'], font=f_sub, fill=(90, 60, 45))
    
    # Top Right: Luxury Price & Pack Spec Card
    card_w, card_h = 250, 105
    card_x = size[0] - card_w - 60
    card_y = 50
    
    card = Image.new('RGBA', (card_w, card_h), (0, 0, 0, 0))
    c_d = ImageDraw.Draw(card)
    c_d.rounded_rectangle([0, 0, card_w-1, card_h-1], radius=8, fill=(255, 253, 250, 245), outline=(201, 154, 67, 220), width=2)
    
    f_pack_chip = get_font('segoeuib.ttf', 14)
    f_price_big = get_font('georgiab.ttf', 38)
    f_mrp_sub = get_font('segoeui.ttf', 12)
    
    chip_text = f"FAMILY PACK: {p['weight']}" if p['is_500g'] else f"NET WEIGHT: {p['weight']}"
    c_d.rounded_rectangle([12, 10, card_w-12, 34], radius=4, fill=(59, 33, 24, 255))
    chip_bbox = c_d.textbbox((0, 0), chip_text, font=f_pack_chip)
    chip_x = (card_w - (chip_bbox[2] - chip_bbox[0])) // 2
    c_d.text((chip_x, 13), chip_text, font=f_pack_chip, fill=(230, 185, 106))
    
    pr_bbox = c_d.textbbox((0, 0), p['price'], font=f_price_big)
    pr_x = (card_w - (pr_bbox[2] - pr_bbox[0])) // 2
    c_d.text((pr_x, 38), p['price'], font=f_price_big, fill=(180, 30, 30))
    
    mrp_text = 'M.R.P. (Incl. of all taxes)'
    mrp_bbox = c_d.textbbox((0, 0), mrp_text, font=f_mrp_sub)
    mrp_x = (card_w - (mrp_bbox[2] - mrp_bbox[0])) // 2
    c_d.text((mrp_x, 82), mrp_text, font=f_mrp_sub, fill=(120, 100, 90))
    
    canvas.paste(card, (card_x, card_y), card)
    
    # Bottom Left: Heritage & Authenticity Stamp
    stamp_w, stamp_h = 240, 60
    stamp = Image.new('RGBA', (stamp_w, stamp_h), (0, 0, 0, 0))
    st_d = ImageDraw.Draw(stamp)
    f_st_top = get_font('georgiab.ttf', 12)
    f_st_sub = get_font('segoeui.ttf', 11)
    st_d.text((0, 8), 'AUTHENTIC TEMPLE TOWN ROAST', font=f_st_top, fill=(140, 100, 50))
    st_d.text((0, 26), 'FSSAI Lic. No. 12423999001234', font=f_st_sub, fill=(160, 130, 100))
    st_d.text((0, 42), 'Traditional Brass Filter Blend', font=f_st_sub, fill=(160, 130, 100))
    canvas.paste(stamp, (60, 1060), stamp)
    
    # Bottom Bar: Quality Trust Seals
    f_foot = get_font('georgia.ttf', 14)
    foot_text = '100% PURE SOUTH INDIAN ROAST  •  SLOW ROASTED BEANS  •  RICH AROMA  •  TEMPLE TOWN HERITAGE'
    ft_bbox = draw.textbbox((0, 0), foot_text, font=f_foot)
    ft_x = (size[0] - (ft_bbox[2] - ft_bbox[0])) // 2
    draw.line([(60, 1140), (1140, 1140)], fill=(201, 154, 67, 100), width=1)
    draw.text((ft_x, 1152), foot_text, font=f_foot, fill=(140, 110, 80))
    
    canvas.convert('RGB').save(out_path, quality=95)
    file_size_kb = os.path.getsize(out_path) / 1024
    print(f"[{p['num']}/08] Generated {p['filename']} ({size[0]}x{size[1]}, {file_size_kb:.1f} KB)")
    print(f"       Product: {p['title']} | Weight: {p['weight']} | Price: {p['price']}")

if __name__ == '__main__':
    print('Starting generation of all 8 TEMPLEBREW product variations...')
    for p in products:
        render_product(p)
    print('All 8 product variation images rendered successfully!')

