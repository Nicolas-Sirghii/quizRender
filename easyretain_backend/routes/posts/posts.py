from fastapi import APIRouter, UploadFile, File, Form, Header, HTTPException
import uuid
import json
import jwt
from credentials.credentials import sql_conn, s3_aws, secret_key, aws_bucket_name

createPost = APIRouter()

SECRET_KEY = secret_key()
BUCKET_NAME = aws_bucket_name()
s3 = s3_aws()


def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


@createPost.post("/cards/create")
async def create_card(
    image: UploadFile = File(...),
    ratio: float = Form(...),
    rects: str = Form(...),
    authorization: str = Header(None)
):
    # -------------------------
    # AUTH (same pattern as yours)
    # -------------------------
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]
    user_id = get_current_user(token)

    # -------------------------
    # CREATE CARD ID
    # -------------------------
    card_id = str(uuid.uuid4())

    # -------------------------
    # UPLOAD IMAGE TO S3
    # -------------------------
    file_ext = image.filename.split(".")[-1]
    filename = f"cards/{card_id}.{file_ext}"

    s3.upload_fileobj(
        image.file,
        BUCKET_NAME,
        filename,
        ExtraArgs={"ContentType": image.content_type}
    )

    image_url = f"https://{BUCKET_NAME}.s3.amazonaws.com/{filename}"

    # -------------------------
    # DB CONNECTION
    # -------------------------
    db = sql_conn()
    cursor = db.cursor()

    # -------------------------
    # INSERT CARD
    # -------------------------
    cursor.execute("""
        INSERT INTO cards (id, user_id, image_url, ratio)
        VALUES (%s, %s, %s, %s)
    """, (card_id, user_id, image_url, ratio))

    # -------------------------
    # INSERT RECTS
    # -------------------------
    rect_list = json.loads(rects)

    for r in rect_list:
        cursor.execute("""
            INSERT INTO card_rects
            (id, card_id, question, answer, x, y, width, height, num)
            VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s)
        """, (
            r["id"],
            card_id,
            r["question"],
            r["answer"],
            r["x"],
            r["y"],
            r["width"],
            r["height"],
            r["num"]
        ))

    db.commit()
    cursor.close()
    db.close()

    return {
        "message": "Card created successfully",
        "card_id": card_id,
        "image_url": image_url
    }