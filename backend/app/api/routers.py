from typing import List, Annotated, Optional

from fastapi import APIRouter, Depends

from app.api.schemas import Concert, ConcertIn
from app.infrastructure.database.connection import get_db
from app.infrastructure.repositories.concert_repository import ConcertRepository
from app.application.services.concert_service import ConcertService

router = APIRouter(prefix="/concerts", tags=["Concerts"])

def get_concert_repository(db=Depends(get_db)):
    return ConcertRepository(db)

def get_concert_service(repo=Depends(get_concert_repository)):
    return ConcertService(repo)

ConcertServiceDp = Annotated[ConcertService, Depends(get_concert_service)]


@router.post("", response_model=Concert)
async def create_concert(
    data: ConcertIn,
    service: ConcertServiceDp,
):
    return await service.create(data)

@router.get("", response_model=List[Concert])
async def get_concert(
    service: ConcertServiceDp,
    concert_id: Optional[int] = None
):
    return await service.get(id=concert_id)

@router.put("/{concert_id}", response_model=List[Concert])
async def update_concert(
    concert_id: int,
    data: Concert,
    service: ConcertServiceDp,
):
    return await service.update(concert_id, data)

@router.delete("/{concert_id}", response_model=List[Concert])
async def delete_concert(
    concert_id: int,
    service: ConcertServiceDp,
):
    return await service.delete(concert_id)