def normalize_comma_separated_values(value):
    normalized_values = []

    for item in value.split(","):
        item = item.strip()

        if item:
            normalized_values.append(item)

    return ", ".join(normalized_values)


def normalize_unsorted_list_text(value):
    normalized_entries = []

    for list_entry in value.splitlines():
        list_entry = list_entry.strip()

        if not list_entry.strip("'\" "):
            continue

        if list_entry.startswith("-"):
            list_entry = list_entry[1:].strip()

        if list_entry:
            normalized_entries.append(f"- {list_entry}")

    return "\n".join(normalized_entries)


def parse_unsorted_list(value):
    return [
        list_entry.removeprefix("- ")
        for list_entry in normalize_unsorted_list_text(value).splitlines()
    ]
