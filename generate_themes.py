import os
import base64
import json
import yaml
import requests
from pathlib import Path

CONFIG_PATH = os.path.expanduser("~/.hermes/config.yaml")
OUT_DIR = Path(__file__).parent / "public" / "images"
OUT_DIR.mkdir(parents=True, exist_ok=True)


def load_venice_key():
    with open(CONFIG_PATH) as f:
        config = yaml.safe_load(f)
    return config["model"]["api_key"]


def generate_image(
    api_key: str,
    prompt: str,
    filename: str,
    aspect_ratio: str = "1:1",
    resolution: str = "1K",
    quality: str = "high",
    model: str = "gpt-image-2",
):
    print(f"Generating {filename} ...")
    resp = requests.post(
        "https://api.venice.ai/api/v1/image/generate",
        headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
        json={
            "model": model,
            "prompt": prompt,
            "aspect_ratio": aspect_ratio,
            "resolution": resolution,
            "quality": quality,
            "format": "png",
        },
        timeout=300,
    )
    if not resp.ok:
        raise RuntimeError(f"{resp.status_code}: {resp.text[:500]}")
    data = resp.json()
    if data.get("error"):
        raise RuntimeError(data["error"])
    b64 = data["images"][0]
    img_bytes = base64.b64decode(b64)
    out_path = OUT_DIR / filename
    out_path.write_bytes(img_bytes)
    print(f"Saved {out_path} ({len(img_bytes)} bytes)")
    return str(out_path)


def main():
    api_key = load_venice_key()

    prompts = {
        "hero-indian.png": (
            "A beautiful digital illustration of an ancient Indian knowledge harness system. "
            "Imagine a vast dark observatory with indigo and saffron fabrics, brass gears, scrolls, "
            "lotus motifs, and glowing celestial maps arranged in layers. "
            "Interconnected nodes of golden light flow between manuscript pages, abacus-like mechanisms, and papyrus scrolls. "
            "Midnight blue background (#050507), rich Indian miniature painting style, cinematic lighting, no text, no faces."
        ),
        "hero-egyptian.png": (
            "A majestic digital illustration of an ancient Egyptian knowledge harness system. "
            "A grand hall of dark lapis stone, golden papyrus columns, lotus capitals, star maps on the ceiling, "
            "and hieroglyphic panels connected by threads of golden light. "
            "Interconnected nodes of light flow between scrolls, stone tablets, and measuring tools. "
            "Midnight blue background (#050507), cinematic lighting, no text, no faces."
        ),
        "hero-unified.png": (
            "A unified digital illustration blending ancient Indian and Egyptian harness systems into one harmonious whole. "
            "Half the scene shows Indian observatory elements: saffron and indigo fabrics, brass gears, lotus mandalas, and celestial scrolls. "
            "The other half shows Egyptian elements: lapis stone columns, golden papyrus, hieroglyphic geometry, and star charts. "
            "The two halves merge at the center into a single glowing network of nodes and flowing light paths. "
            "Deep midnight blue background (#050507), rich gold accents, cinematic lighting, symmetrical composition, no text, no faces."
        ),
        "card-indian.png": (
            "Square decorative artwork for a dark-mode website card, ancient Indian knowledge theme. "
            "Intricate mandala, lotus petals, paisley patterns, brass astronomical instruments, glowing nodes of light. "
            "Indigo, saffron, and gold palette on deep dark background. Abstract, no text, no faces."
        ),
        "card-egyptian.png": (
            "Square decorative artwork for a dark-mode website card, ancient Egyptian knowledge theme. "
            "Geometric lotus and papyrus motifs, lapis stone texture, golden star maps, glowing nodes of light. "
            "Lapis blue, gold, and sand palette on deep dark background. Abstract, no text, no faces."
        ),
        "card-unified.png": (
            "Square decorative artwork for a dark-mode website card, unified Indo-Egyptian knowledge theme. "
            "Mandala patterns blending with hieroglyphic geometry, lotus and papyrus motifs, golden flowing light network. "
            "Indigo, lapis blue, saffron, and gold palette on deep dark background. Abstract, no text, no faces."
        ),
    }

    manifest = {}
    for filename, prompt in prompts.items():
        is_hero = filename.startswith("hero")
        path = generate_image(
            api_key,
            prompt,
            filename,
            aspect_ratio="16:9" if is_hero else "1:1",
            resolution="2K" if is_hero else "1K",
        )
        manifest[filename] = {"prompt": prompt, "path": path}

    manifest_path = OUT_DIR / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2))
    print(f"Manifest saved to {manifest_path}")


if __name__ == "__main__":
    main()
