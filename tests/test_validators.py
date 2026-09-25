from backend.utils.validators import validate_marks
import pytest

def test_valid_marks():
    validate_marks(8, 10)

def test_invalid_marks():
    with pytest.raises(Exception):
        validate_marks(11, 10)
