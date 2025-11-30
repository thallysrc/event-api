from app.api.schemas import ConcertIn
from app.infrastructure.models.concert_model import Concert
from app.infrastructure.repositories.concert_repository import ConcertRepository


class ConcertService:
    def __init__(self, concert_repository: ConcertRepository):
        self.concert_repository = concert_repository

    async def create(self, concert_data: ConcertIn):
        concert = Concert(**concert_data.model_dump())
        return self.concert_repository.insert(concert)

    async def get(self, **filters):
        return self.concert_repository.get(filters)

    async def update(self, event_id, concert_data):
        return self.concert_repository.update(event_id, concert_data)

    async def delete(self, event_id):
        return self.concert_repository.delete(event_id)