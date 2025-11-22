def similar_elements(test_tup1, test_tup2):
    return tuple(sorted(set(test_tup1) & set(test_tup2)))

if __name__ == "__main__":
    assert similar_elements((3, 4, 5, 6), (5, 7, 4, 10)) == (4, 5)
    assert similar_elements((1, 2, 3, 4), (5, 4, 3, 7)) == (3, 4)
    assert similar_elements((11, 12, 14, 13), (17, 15, 14, 13)) == (13, 14)
