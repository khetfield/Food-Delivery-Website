from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class Category(db.Model):
    __tablename__ = "categories"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    order = db.Column(db.Integer, nullable=False)
    name = db.Column(db.String(25), nullable=False)
    business_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("businesses.id")), nullable=False
    )

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    business = db.relationship("Business", back_populates="categories")
    items = db.relationship("Item", back_populates="category")

    @property
    def count(self):
        return len(self.items)

    def to_dict(self, timestamps=False):
        dct = {
            "id": self.id,
            "order": self.order,
            "name": self.name,
            "itemIds": [i.id for i in self.items],
            "count": self.count,
        }

        if timestamps:
            dct["createdAt"] = self.created_at
            dct["updatedAt"] = self.updated_at

        return dct
