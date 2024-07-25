from flask_wtf import FlaskForm
from wtforms import IntegerField
from wtforms.validators import DataRequired, NumberRange


class EditCartItemForm(FlaskForm):
    quantity = IntegerField("quantity", validators=[DataRequired(), NumberRange(1, 99)])
