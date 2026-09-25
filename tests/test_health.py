# Basic import/health test. Run from repository root after dependencies are installed.
from backend.app import app

def test_app_exists():
    assert app.title == "Cloud Assignment Submission Portal API"
