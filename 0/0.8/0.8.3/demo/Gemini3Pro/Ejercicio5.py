def count_ways(n):
    if n % 2 != 0:
        return 0
    if n == 0:
        return 1
    if n == 2:
        return 3
    
    A = [0] * (n + 1)
    A[0] = 1
    A[2] = 3
    
    for i in range(4, n + 1, 2):
        A[i] = 4 * A[i - 2] - A[i - 4]
        
    return A[n]

if __name__ == "__main__":
    assert count_ways(2) == 3
    assert count_ways(8) == 153
    assert count_ways(12) == 2131
