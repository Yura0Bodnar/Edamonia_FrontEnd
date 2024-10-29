from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from starlette.requests import Request
import uvicorn

app = FastAPI()

# Налаштування статичних файлів (CSS, JS)
app.mount("/static", StaticFiles(directory="static"), name="static")

# Налаштування шаблонів HTML
templates = Jinja2Templates(directory="templates")


# Роут для відображення HTML-файлу
@app.get("/", response_class=HTMLResponse)
async def read_root(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

if __name__ == "__main__":
    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)
