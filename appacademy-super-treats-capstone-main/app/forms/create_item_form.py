from flask_wtf import FlaskForm
from flask_wtf.file import FileField, FileAllowed
from wtforms import StringField, FloatField, IntegerField
from wtforms.validators import DataRequired, Length, NumberRange, ValidationError
from app.utils.aws import ALLOWED_EXTENSIONS


class CreateItemForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), Length(1, 50)])
    image = FileField("image", validators=[FileAllowed(list(ALLOWED_EXTENSIONS))])
    about = StringField("about", validators=[Length(0, 255)])
    price = FloatField("price", validators=[NumberRange(0, 1000)])
    business_id = IntegerField("business_id", validators=[DataRequired()])
    category_id = IntegerField("category_id")
