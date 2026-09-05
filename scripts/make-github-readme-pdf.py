#!/usr/bin/env python3
"""GitHub README as a printable PDF for chat download / repo upload."""
from pathlib import Path

from fpdf import FPDF

ROOT = Path("/workspace")
README = (ROOT / "README.md").read_text(encoding="utf-8")
OUT = ROOT / "public" / "S1R1US-GitHub-README.pdf"
ART = ROOT / "artifacts" / "S1R1US-GitHub-README.pdf"


def latin(s: str) -> str:
    return (
        s.replace("—", "-")
        .replace("–", "-")
        .replace("’", "'")
        .replace("“", '"')
        .replace("”", '"')
        .replace("**", "")
        .replace("`", "")
        .encode("latin-1", "replace")
        .decode("latin-1")
    )


class Pdf(FPDF):
    def footer(self) -> None:
        self.set_y(-12)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(120, 120, 120)
        self.cell(0, 8, latin(f"S1R1U$ GitHub README  |  Apache-2.0  |  {self.page_no()}"), align="C")


pdf = Pdf(format="Letter")
pdf.set_auto_page_break(auto=True, margin=18)
pdf.add_page()
pdf.set_text_color(20, 90, 32)
pdf.set_font("Helvetica", "B", 18)
pdf.set_xy(16, 16)
pdf.cell(0, 10, latin("[ S1R1U$ <<L@B$>> ]"), ln=1)
pdf.set_font("Helvetica", "", 10)
pdf.set_text_color(80, 80, 80)
pdf.set_x(16)
pdf.cell(0, 6, latin("GitHub README  |  upload with Apache License 2.0"), ln=1)
pdf.set_draw_color(20, 90, 32)
pdf.line(16, 34, 200, 34)
pdf.ln(8)

y = pdf.get_y()
pdf.set_xy(16, y)
for raw in README.splitlines():
    line = raw.rstrip()
    if not line:
        pdf.ln(3)
        continue
    if line.startswith("# "):
        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(20, 90, 32)
        pdf.multi_cell(180, 8, latin(line.lstrip("# ").strip()))
        pdf.ln(1)
        continue
    if line.startswith("## "):
        pdf.ln(2)
        pdf.set_font("Helvetica", "B", 12)
        pdf.set_text_color(20, 90, 32)
        pdf.multi_cell(180, 7, latin(line.lstrip("# ").strip()))
        pdf.ln(1)
        continue
    if line.startswith("|"):
        pdf.set_font("Helvetica", "", 8)
        pdf.set_text_color(40, 40, 40)
        if set(line.replace("|", "").strip()) <= set("-: "):
            continue
        cells = [c.strip() for c in line.strip("|").split("|")]
        pdf.multi_cell(180, 5, latin("  |  ".join(cells)))
        continue
    if line.startswith("- ") or line.startswith("1.") or line.startswith("2.") or line.startswith("3."):
        pdf.set_font("Helvetica", "", 10)
        pdf.set_text_color(30, 30, 30)
        pdf.multi_cell(180, 5.5, latin(line))
        continue
    if line.startswith("```"):
        continue
    pdf.set_font("Courier" if line.startswith("npm") else "Helvetica", "", 10)
    pdf.set_text_color(20, 90, 32 if line.startswith("npm") else 30)
    pdf.multi_cell(180, 5.5, latin(line))

pdf.output(str(OUT))
ART.parent.mkdir(parents=True, exist_ok=True)
ART.write_bytes(OUT.read_bytes())
print({"ok": True, "bytes": OUT.stat().st_size, "pdf": str(OUT), "pages": pdf.page_no()})
