from .db import db, environment, SCHEMA, add_prefix_for_prod
from sqlalchemy.sql import func


class Cart(db.Model):
    __tablename__ = "carts"

    if environment == "production":
        __table_args__ = {"schema": SCHEMA}

    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey(add_prefix_for_prod("users.id")))
    business_id = db.Column(
        db.Integer, db.ForeignKey(add_prefix_for_prod("businesses.id"))
    )
    address = db.Column(db.String(255), nullable=False)
    created_at = db.Column(db.DateTime(timezone=True), server_default=func.now())
    updated_at = db.Column(
        db.DateTime(timezone=True), server_default=func.now(), onupdate=func.now()
    )

    user = db.relationship("User", back_populates="carts")
    business = db.relationship("Business", back_populates="carts")
    cart_items = db.relationship(
        "CartItem", back_populates="cart", cascade="all, delete-orphan"
    )

    @property
    def item_count(self):
        count = 0
        if self.business:
            for i in self.cart_items:
                count = count + i.quantity
        return count

    @property
    def total_price(self):
        price = 0
        if self.business:
            for i in self.cart_items:
                price = price + i.price
        return price

    def to_dict(self, timestamps=False):
        dct = {
            "id": self.id,
            "userId": self.user_id,
            "address": self.address,
            "businessId": self.business_id,
            "cartItems": {i.id: i.to_dict() for i in self.cart_items},
            "count": self.item_count,
            "price": self.total_price,
        }

        if timestamps:
            dct["createdAt"] = self.created_at
            dct["updatedAt"] = self.updated_at

        return dct

    def to_dict_agg(self):
        return {
            "count": self.item_count,
            "price": self.total_price,
            "businessId": self.business_id,
        }
