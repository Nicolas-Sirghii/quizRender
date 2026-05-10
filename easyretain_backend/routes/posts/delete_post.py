from fastapi import APIRouter, Header, HTTPException
import jwt

from credentials.credentials import sql_conn, s3_aws, secret_key, aws_bucket_name

deletePost = APIRouter()

SECRET_KEY = secret_key()
BUCKET_NAME = aws_bucket_name()
s3 = s3_aws()


def get_current_user(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
        return payload["user_id"]
    except:
        raise HTTPException(status_code=401, detail="Invalid token")


@deletePost.delete("/cards/delete/{card_id}")
async def delete_card(
    card_id: str,
    authorization: str = Header(None)
):
    # -------------------------
    # AUTH
    # -------------------------
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing token")

    token = authorization.split(" ")[1]
    user_id = get_current_user(token)

    # -------------------------
    # DB CONNECTION
    # -------------------------
    db = sql_conn()
    cursor = db.cursor()

    try:
        # -------------------------
        # GET CARD + CHECK OWNER
        # -------------------------
        cursor.execute("""
            SELECT image_url, user_id
            FROM cards
            WHERE id = %s
        """, (card_id,))

        card = cursor.fetchone()

        if not card:
            raise HTTPException(status_code=404, detail="Card not found")

        image_url = card[0]
        card_owner_id = card[1]

        # only owner can delete
        if str(card_owner_id) != str(user_id):
            raise HTTPException(status_code=403, detail="Not allowed")

        # -------------------------
        # EXTRACT S3 FILE PATH
        # -------------------------
        # example:
        # https://bucket-name.s3.amazonaws.com/users/test/cards/123.png
        s3_path = image_url.split(".amazonaws.com/")[-1]

        # -------------------------
        # DELETE IMAGE FROM S3
        # -------------------------
        s3.delete_object(
            Bucket=BUCKET_NAME,
            Key=s3_path
        )

        # -------------------------
        # DELETE RECTS FIRST
        # -------------------------
        cursor.execute("""
            DELETE FROM card_rects
            WHERE card_id = %s
        """, (card_id,))

        # -------------------------
        # DELETE CARD
        # -------------------------
        cursor.execute("""
            DELETE FROM cards
            WHERE id = %s
        """, (card_id,))

        db.commit()

        return {
            "message": "Card deleted successfully",
            "card_id": card_id,
            "deleted_s3_path": s3_path
        }

    except Exception as e:
        db.rollback()
        raise HTTPException(status_code=500, detail=str(e))

    finally:
        cursor.close()
        db.close()