from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class CartItem(db.Model):
    __tablename__ = "cart_items"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    _quantity = db.Column(db.Integer, nullable=False)
    item_id = db.Column(
        db.Integer,
        db.ForeignKey(add_prefix_for_prod("items.id"), ondelete="SET NULL"),
        nullable=True,
    )
    cart_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("carts.id")), nullable=False
    )

    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    item = db.relationship("Item")
    cart = db.relationship("Cart", back_populates="cart_items")

    @property
    def price(self):
        return self.item.price * self._quantity if self.item else 0

    @property
    def quantity(self):
        return self._quantity if self.item else 0

    @quantity.setter
    def quantity(self, val):
        self._quantity = val

    def to_dict(self, timestamps=False):
        dct = {
            "id": self.id,
            "quantity": self.quantity,
            "itemId": self.item_id if self.item else None,
            "price": self.price,
            "cartId": self.cart_id,
        }

        if timestamps:
            dct["createdAt"] = self.created_at
            dct["updatedAt"] = self.updated_at

        return dct
