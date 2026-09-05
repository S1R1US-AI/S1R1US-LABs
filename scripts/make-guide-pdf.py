#!/usr/bin/env python3
"""Render public/helios-desk-guide.md to a print-ready PDF."""

from pathlib import Path

from fpdf import FPDF

MD = Path("/workspace/public/helios-desk-guide.md")
OUT = Path("/workspace/public/helios-desk-guide.pdf")


def latin(text: str) -> str:
    repl = {
        "→": "->",
        "←": "<-",
        "↔": "<->",
        "—": "--",
        "–": "-",
        "’": "'",
        "‘": "'",
        "“": '"',
        "”": '"',
        "≤": "<=",
        "≥": ">=",
        "·": "-",
        "×": "x",
        "…": "...",
    }
    for a, b in repl.items():
        text = text.replace(a, b)
    return text.encode("latin-1", "replace").decode("latin-1")


class GuidePDF(FPDF):
    def header(self):
        if self.page_no() == 1:
            return
        self.set_font("Helvetica", "", 8)
        self.set_text_color(90, 90, 86)
        self.cell(0, 8, "Helios Desk  -  Seven-bot bitcoin accumulator", align="L")
        self.set_x(18)
        self.cell(0, 8, str(self.page_no()), align="R", new_x="LMARGIN", new_y="NEXT")
        self.set_draw_color(42, 45, 41)
        self.line(18, 16, 192, 16)
        self.ln(4)

    def footer(self):
        self.set_y(-14)
        self.set_font("Helvetica", "", 8)
        self.set_text_color(120, 120, 114)
        self.cell(
            0,
            8,
            "Not investment advice. SuperGrok is the only paid service.",
            align="C",
        )


def add_wrapped(pdf: GuidePDF, text: str, size=11, style="", color=(22, 20, 18), lh=6.2):
    pdf.set_font("Helvetica", style, size)
    pdf.set_text_color(*color)
    pdf.multi_cell(0, lh, latin(text))
    pdf.ln(1.2)


def main():
    raw = MD.read_text(encoding="utf-8")
    pdf = GuidePDF(format="Letter")
    pdf.set_auto_page_break(auto=True, margin=18)
    pdf.set_margins(18, 18, 18)
    pdf.add_page()
    pdf.set_fill_color(14, 16, 15)
    pdf.rect(0, 0, 216, 42, "F")
    pdf.set_text_color(200, 212, 200)
    pdf.set_xy(18, 14)
    pdf.set_font("Helvetica", "", 9)
    pdf.cell(0, 6, "OPERATING MANUAL  -  1 SEPTEMBER 2026")
    pdf.set_xy(18, 22)
    pdf.set_font("Helvetica", "B", 20)
    pdf.set_text_color(236, 234, 227)
    pdf.cell(0, 10, "Helios Desk")
    pdf.ln(18)

    for line in raw.splitlines():
        line = line.rstrip()
        if not line:
            pdf.ln(1.5)
            continue
        if line.startswith("# "):
            continue
        if line.startswith("## "):
            pdf.ln(3)
            add_wrapped(pdf, line[3:], size=13, style="B", color=(14, 16, 15), lh=7)
            continue
        if line.startswith("*") and line.endswith("*"):
            add_wrapped(pdf, line.strip("*"), size=11, style="I", color=(80, 82, 76), lh=6)
            continue
        if line.startswith("> "):
            add_wrapped(pdf, line[2:], size=10, style="I", color=(90, 90, 86), lh=5.8)
            continue
        add_wrapped(pdf, line, size=10.5, color=(28, 28, 26), lh=5.8)

    pdf.output(str(OUT))
    print(f"wrote {OUT} ({OUT.stat().st_size} bytes)")


if __name__ == "__main__":
    main()
