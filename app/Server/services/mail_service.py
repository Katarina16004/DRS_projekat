from mailjet_rest import Client
import os


def send_email(
    to_email: str,
    to_name: str,
    subject: str,
    text_part: str,
    attachment_path: str = None,
) -> bool:
    api_key = os.getenv("MAILJET_API_KEY")
    api_secret = os.getenv("MAILJET_API_SECRET")

    if not api_key or not api_secret:
        raise RuntimeError("Mailjet API keys are missing")

    mailjet = Client(auth=(api_key, api_secret), version="v3.1")

    message = {
        "From": {
            "Email": os.getenv("MAILJET_SENDER_EMAIL"),
            "Name": os.getenv("MAILJET_SENDER_NAME"),
        },
        "To": [{"Email": to_email, "Name": to_name}],
        "Subject": subject,
        "TextPart": text_part,
    }

    # Add attachment if provided
    if attachment_path:
        with open(attachment_path, "rb") as f:
            encoded_file = base64.b64encode(f.read()).decode()
        attachment = {
            "ContentType": "application/octet-stream",  # change if you know MIME type
            "Filename": os.path.basename(attachment_path),
            "Base64Content": encoded_file,
        }
        message["Attachments"] = [attachment]

    data = {"Messages": [message]}

    try:
        result = mailjet.send.create(data=data)
        if result.status_code != 200:
            return False

        response = result.json()
        return response["Messages"][0]["Status"] == "success"

    except Exception as e:
        print("Error sending email:", e)
        return False