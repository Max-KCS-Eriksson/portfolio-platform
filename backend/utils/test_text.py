from django.test import SimpleTestCase

from .text import normalize_unsorted_list_text, parse_unsorted_list


class ParseUnsortedListTest(SimpleTestCase):
    def setUp(self):
        self.items = ["First item", "Second item", "Third item"]
        self.expected_normalization = (
            f"- {self.items[0]}\n- {self.items[1]}\n- {self.items[2]}"
        )
        self.expected_list = [
            f"{self.items[0]}",
            f"{self.items[1]}",
            f"{self.items[2]}",
        ]

    def test_normalizes_unsorted_list_text(self):
        self.assertEqual(
            normalize_unsorted_list_text(
                f" -{self.items[0]}\n-{self.items[1]}\n - {self.items[2]}\n       \n \n"
            ),
            self.expected_normalization,
        )

    def test_returns_entries_for_marked_lines(self):
        self.assertEqual(
            parse_unsorted_list(
                f" -{self.items[0]}\n-{self.items[1]}\n - {self.items[2]}\n       \n \n"
            ),
            self.expected_list,
        )
