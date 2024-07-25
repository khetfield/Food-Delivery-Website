from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, FloatField
from wtforms.validators import DataRequired, Length, NumberRange, ValidationError
from ..models.business import types, cuisines, price_ranges
from app.utils.aws import ALLOWED_EXTENSIONS


def cuisine_required(form, field):
    cuisine = field.data
    type = form.data["type"]
    if type == "Restaurant" and cuisine == None:
        raise ValidationError("Cuisine is required for type Restaurant")


def valid_cuisine(form, field):
    cuisine = field.data
    type = form.data["type"]
    if type == "Restaurant" and cuisine not in [e.name for e in cuisines]:
        raise ValidationError("Invalid cuisine")


def valid_type(form, field):
    type = field.data
    if not type in [e.name for e in types]:
        raise ValidationError("Invalid type")


def valid_range(form, field):
    price_range = field.data
    if not price_range in [e.name for e in price_ranges]:
        raise ValidationError("Invalid price range")


class EditBusinessForm(FlaskForm):
    address = StringField("address", validators=[DataRequired(), Length(1, 255)])
    name = StringField("address", validators=[DataRequired(), Length(1, 100)])
    type = StringField("type", validators=[DataRequired(), valid_type])
    cuisine = StringField("cuisine", validators=[cuisine_required, valid_cuisine])
    image = FileField("image", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    price_range = StringField("price_range", validators=[DataRequired(), valid_range])
    delivery_fee = FloatField("delivery_fee", validators=[NumberRange(min=0, max=10)])
