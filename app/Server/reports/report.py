from fpdf import FPDF
from datetime import datetime


def generate_game_report(games):
    if not games:
        return None

    pdf = FPDF()
    pdf.add_page()

    pdf.set_font("Arial", "B", 16)
    pdf.cell(200, 10, "QUIZ GAME REPORT", ln=True, align="C")

    pdf.ln(10)

    now = datetime.now()
    date_str = now.strftime("%Y-%m-%d")
    time_str = now.strftime("%H-%M-%S")

    pdf.set_font("Arial", size=12)
    pdf.cell(200, 10, f"Generated: {date_str} {time_str}", ln=True)

    pdf.ln(8)

    pdf.set_font("Arial", "B", 12)
    pdf.cell(40, 10, "Game ID", border=1)
    pdf.cell(40, 10, "Player ID", border=1)
    pdf.cell(40, 10, "Quiz ID", border=1)
    pdf.cell(40, 10, "Score", border=1)
    pdf.ln()

    pdf.set_font("Arial", size=12)
    for game in games:
        pdf.cell(40, 10, str(game["ID_Game"]), border=1)
        pdf.cell(40, 10, str(game["ID_Player"]), border=1)
        pdf.cell(40, 10, str(game["ID_Quiz"]), border=1)
        pdf.cell(40, 10, str(game["Score"]), border=1)
        pdf.ln()

    # ime fajla — uzmi prvog playera i quiz
    first = games[0]
    filename = f"{first['ID_Player']}_{first['ID_Quiz']}_{date_str}_{time_str}_report.pdf"

    pdf.output(filename)

    return filename
