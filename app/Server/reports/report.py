from fpdf import FPDF
from datetime import datetime


def generate_game_report(game):

    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "GAME REPORT", ln=True, align="C")

    pdf.ln(10)

    pdf.set_font("Arial", size=12)

    pdf.cell(200, 10, f"Game ID: {game['ID_Game']}", ln=True)
    pdf.cell(200, 10, f"Player ID: {game['ID_Player']}", ln=True)
    pdf.cell(200, 10, f"Quiz ID: {game['ID_Quiz']}", ln=True)
    pdf.cell(200, 10, f"Score: {game['Score']}", ln=True)

    pdf.ln(5)

    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H-%M-%S")

    pdf.cell(200, 10, f"Date: {date_str}", ln=True)
    pdf.cell(200, 10, f"Time: {time_str}", ln=True)

    filename = f"{game['ID_Player']}_{date_str}_{time_str}_report.pdf"

    pdf.output(filename)

    return filename
