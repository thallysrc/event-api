from datetime import datetime
from typing import Optional

from pydantic import BaseModel, field_validator


class Concert(BaseModel):
    id: Optional[int] = None
    name: str
    date: datetime
    image_url: str
    location: str
    description: str | None = None
    price: float | None = None
    participants: int | None = None

class ConcertIn(BaseModel):
    name: str
    date: datetime
    image_url: str
    location: str
    description: str | None = None
    price: float | None = None
    participants: int | None = None

    @field_validator("date", mode="before")
    def parse_date(cls, v):
        if isinstance(v, str):
            return datetime.strptime(v, "%d/%m/%Y")
        return v

    class Config:
        from_attributes = True