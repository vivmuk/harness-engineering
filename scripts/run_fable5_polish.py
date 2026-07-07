#!/usr/bin/env python3
"""
Run Fable 5 (claude-fable-5) on the harness-engineering polish brief saved at
prompts/harness-engineering-polish.md. Writes the model's HTML output to
experiments/fable5-landing.html and a sidecar JSON with metadata.

Usage:
    python3 scripts/run_fable5_polish.py                # runs once
    python3 scripts/run_fable5_polish.py --dry-run     # skips the API call

Auth: reads api_key from ~/.hermes/config.yaml under the :model: block (the
key that successfully authenticates /v1/chat/completions in this session).
"""
from __future__ import annotations

import argparse
import json
import re
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

import requests

ROOT = Path(__file__).resolve().parent.parent
PROMPT_FILE = ROOT / "prompts" / "harness-engineering-polish.md"
OUT_DIR = ROOT / "experiments"
OUT_HTML = OUT_DIR / "fable5-landing.html"
OUT_META = OUT_DIR / "fable5-landing.meta.json"

API_URL = "https://api.venice.ai/api/v1/chat/completions"
MODEL = "claude-fable-5"
MAX_TOKENS = 8192


def _read_key() -> str | None:
    cfg = Path.home() / ".hermes" / "config.yaml"
    if not cfg.exists():
        return None
    y = cfg.read_text(encoding="utf-8", errors="ignore")
    m = re.search(
        r"^\s*api_key:\s*['\"]?([A-Za-z0-9_\-]{30,})['\"]?",
        y, re.M)
    return m.group(1) if m else None


def _load_prompt() -> str:
    raw = PROMPT_FILE.read_text(encoding="utf-8")
    m = re.search(r"```\s*\n(.*?)```", raw, re.DOTALL)
    if not m:
        raise SystemExit(f"No fenced prompt in {PROMPT_FILE}")
    return m.group(1).strip()


def call(key: str, prompt: str) -> tuple[int, str, dict]:
    t0 = time.time()
    r = requests.post(
        API_URL,
        headers={"Authorization": f"Bearer {key}", "Content-Type": "application/json"},
        json={
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "max_tokens": MAX_TOKENS,
            "temperature": 0.5,
            "stream": False,
        },
        timeout=300,
    )
    elapsed = time.time() - t0
    if r.status_code != 200:
        return r.status_code, r.text[:600], {"elapsed": round(elapsed, 2)}
    body = r.json()
    try:
        text = body["choices"][0]["message"]["content"]
    except (KeyError, IndexError, TypeError) as e:
        return 200, r.text[:600], {"elapsed": round(elapsed, 2), "error": str(e)}
    usage = body.get("usage", {}) or {}
    return 200, text, {
        "elapsed": round(elapsed, 2),
        "prompt_tokens": usage.get("prompt_tokens"),
        "completion_tokens": usage.get("completion_tokens"),
        "total_tokens": usage.get("total_tokens"),
    }


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true")
    ap.add_argument("--max-tokens", type=int, default=MAX_TOKENS)
    args = ap.parse_args()

    OUT_DIR.mkdir(parents=True, exist_ok=True)
    prompt = _load_prompt()
    print(f"Loaded prompt: {len(prompt)} chars from {PROMPT_FILE.name}")
    print(f"Model: {MODEL}  max_tokens: {args.max_tokens}  output: {OUT_HTML.relative_to(ROOT)}")

    meta = {
        "model": MODEL,
        "max_tokens": args.max_tokens,
        "prompt_chars": len(prompt),
        "ran_at": datetime.now(timezone.utc).isoformat(),
        "dry_run": bool(args.dry_run),
    }

    if args.dry_run:
        meta["status"] = "dry-run"
        OUT_HTML.write_text(
            "<!DOCTYPE html><html><body><p style=\"font-family:monospace\">"
            "[dry-run placeholder for the Fable 5 polish reference]</p></body></html>",
            encoding="utf-8")
        OUT_META.write_text(json.dumps(meta, indent=2), encoding="utf-8")
        print(f"Wrote {OUT_HTML.relative_to(ROOT)} (placeholder)")
        return 0

    key = _read_key()
    if not key:
        print("ERROR: cannot read api_key from ~/.hermes/config.yaml", file=sys.stderr)
        return 2

    status, body, info = call(key, prompt)
    if status != 200:
        meta.update({"status": "error", "http_status": status, "error_excerpt": body[:300]})
        OUT_META.write_text(json.dumps(meta, indent=2), encoding="utf-8")
        print(f"ERROR HTTP {status}: {body[:200]}")
        return 1

    meta.update(info)
    meta.update({
        "status": "ok",
        "response_chars": len(body),
        "starts_with": body[:80],
        "ends_with": body[-80:],
    })
    OUT_HTML.write_text(body, encoding="utf-8")
    OUT_META.write_text(json.dumps(meta, indent=2), encoding="utf-8")
    print(f"Wrote {OUT_HTML.relative_to(ROOT)}  ({len(body):,} chars)  in {info['elapsed']:.1f}s")
    print(f"Tokens: {info.get('completion_tokens')} completion  /  {info.get('prompt_tokens')} prompt  /  {info.get('total_tokens')} total")
    return 0


if __name__ == "__main__":
    sys.exit(main())
