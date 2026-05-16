from django.test import SimpleTestCase

from .api import parse_optional_bool_query_pram


class ParseOptionalBoolQueryParamTest(SimpleTestCase):
    def test_parses_true_query_param(self):
        self.assertTrue(parse_optional_bool_query_pram("true"))

    def test_parses_false_query_param(self):
        self.assertFalse(parse_optional_bool_query_pram("false"))

    def test_parses_not_case_sensitive(self):
        self.assertTrue(parse_optional_bool_query_pram("tRue"))
        self.assertFalse(parse_optional_bool_query_pram("falSe"))

    def test_returns_none_for_missing_or_unsupported_query_param(self):
        unsupported_values = (None, "", "yes", "0")

        for value in unsupported_values:
            with self.subTest(value=value):
                self.assertIsNone(parse_optional_bool_query_pram(value))
