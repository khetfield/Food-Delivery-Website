from flask_wtf import FlaskForm
from wtforms import IntegerField, StringField
from wtforms.validators import DataRequired, Length


class CreateCategoryForm(FlaskForm):
    business_id = IntegerField("business_id", validators=[DataRequired()])
    name = StringField("name", validators=[DataRequired(), Length(1, 25)])
