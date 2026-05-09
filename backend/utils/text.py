def normalize_comma_separated_values(value):
    normalized_values = []

    for item in value.split(","):
        item = item.strip()

        if item:
            normalized_values.append(item)

    return ", ".join(normalized_values)
