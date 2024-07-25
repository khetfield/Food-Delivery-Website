from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, NumberRange, Length


class CreateCartItemForm(FlaskForm):
    item_id = IntegerField("item_id", validators=[DataRequired()])
    quantity = IntegerField("quantity", validators=[DataRequired(), NumberRange(1, 99)])
    address = StringField("address", validators=[DataRequired(), Length(1, 255)])
