from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class EditCartForm(FlaskForm):
    address = StringField("address", validators=[DataRequired(), Length(1, 255)])
