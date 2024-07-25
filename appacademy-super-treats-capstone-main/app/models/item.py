from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class Item(db.Model):
    __tablename__ = "items"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(50), nullable=False)
    price = db.Column(db.Numeric(6, 2), nullable=False)
    image = db.Column(db.String(255), nullable=True)
    about = db.Column(db.String(255), nullable=True)
    business_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("businesses.id")), nullable=False
    )
    category_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("categories.id")), nullable=True
    )

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    business = db.relationship("Business", back_populates="items")
    category = db.relationship("Category", back_populates="items")

    _cart_item_id = None

    @property
    def cart_item_id(self):
        return self._cart_item_id

    @cart_item_id.setter
    def cart_item_id(self, id):
        self._cart_item_id = id

    def to_dict(self, timestamps=False):
        dct = {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "image": self.image,
            "about": self.about,
            "cartItemId": self.cart_item_id,
            "categoryId": self.category_id,
        }

        if timestamps:
            dct["createdAt"] = self.created_at
            dct["updatedAt"] = self.updated_at

        return dct

    def cart_to_dict(self):
        return {
            "id": self.id,
            "name": self.name,
            "price": self.price,
            "image": self.image,
            "businessId": self.business_id,
        }
