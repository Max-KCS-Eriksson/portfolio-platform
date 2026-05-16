def parse_optional_bool_query_pram(query_param):
    if not query_param:
        return None

    query_param = query_param.lower()
    if query_param == "true":
        return True
    if query_param == "false":
        return False
