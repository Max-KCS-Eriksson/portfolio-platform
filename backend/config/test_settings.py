from unittest import TestCase
from unittest.mock import patch

from config.settings import get_bool_env


class GetBoolEnvTestCase(TestCase):
    def test_returns_true_for_explicit_truthy_values(self):
        for value in ("1", "true", "True", "yes", "on"):
            with self.subTest(value=value), patch.dict("os.environ", {"SETTING_FLAG": value}):
                self.assertTrue(get_bool_env("SETTING_FLAG"))

    def test_returns_false_for_explicit_falsey_values(self):
        for value in ("0", "false", "False", "no", "off", ""):
            with self.subTest(value=value), patch.dict("os.environ", {"SETTING_FLAG": value}):
                self.assertFalse(get_bool_env("SETTING_FLAG"))

    def test_returns_default_for_missing_values(self):
        with patch.dict("os.environ", {}, clear=True):
            self.assertTrue(get_bool_env("SETTING_FLAG", default=True))
            self.assertFalse(get_bool_env("SETTING_FLAG", default=False))
