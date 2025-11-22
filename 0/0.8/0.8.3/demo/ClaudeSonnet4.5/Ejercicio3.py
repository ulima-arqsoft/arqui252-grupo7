import math

def is_not_prime(n):
    if n < 2:
        return True
    if n == 2:
        return False
    if n % 2 == 0:
        return True
    for i in range(3, int(math.sqrt(n)) + 1, 2):
        if n % i == 0:
            return True
    return False

if __name__ == "__main__":
    assert is_not_prime(2) == False
    assert is_not_prime(10) == True
    assert is_not_prime(35) == True
