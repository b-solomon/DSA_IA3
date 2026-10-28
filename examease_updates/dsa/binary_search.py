def binary_search(arr, target, key=None):
    if key is None:
        key = lambda x: x["reg_no"] if isinstance(x, dict) and "reg_no" in x else x
    low = 0
    high = len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        mid_val = key(arr[mid])
        if mid_val == target:
            return arr[mid]
        elif mid_val < target:
            low = mid + 1
        else:
            high = mid - 1
    return None
