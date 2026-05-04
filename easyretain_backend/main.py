from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.user_information.user_data import update_user_data
from routes.auth.user_autorization import user_auth_router
from routes.posts.posts import createPost
from routes.posts.feed import feed

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_auth_router)
app.include_router(update_user_data)
app.include_router(createPost)
app.include_router(feed)

