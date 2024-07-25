from flask_wtf import FlaskForm
from wtforms import StringField
from wtforms.validators import DataRequired, Length


class EditCategoryForm(FlaskForm):
    name = StringField("name", validators=[DataRequired(), Length(1, 25)])
