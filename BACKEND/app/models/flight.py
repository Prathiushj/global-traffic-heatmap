from sqlalchemy import Column, String, Float
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

class Flight(Base):
    __tablename__ = "flights"

    flight_id = Column(String, primary_key=True, index=True)
    lat = Column(Float)
    lon = Column(Float)
    altitude = Column(Float)
    timestamp = Column(String)