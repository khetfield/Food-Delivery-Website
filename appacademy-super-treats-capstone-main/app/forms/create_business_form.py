from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField
from wtforms.validators import DataRequired, Length, ValidationError
from ..models.business import types, cuisines
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


class CreateBusinessForm(FlaskForm):
    address = StringField("address", validators=[DataRequired(), Length(1, 255)])
    name = StringField("name", validators=[DataRequired(), Length(1, 100)])
    type = StringField("type", validators=[DataRequired(), valid_type])
    cuisine = StringField("cuisine", validators=[cuisine_required, valid_cuisine])
    image = FileField("image", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
