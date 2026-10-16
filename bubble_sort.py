def bubble_sort(arr):
    """对列表进行升序冒泡排序，返回排序后的新列表。"""
    result = list(arr)
    n = len(result)
    for i in range(n - 1):
        swapped = False
        for j in range(n - 1 - i):
            if result[j] > result[j + 1]:
                result[j], result[j + 1] = result[j + 1], result[j]
                swapped = True
        if not swapped:
            break
    return result


if __name__ == "__main__":
    data = [5, 2, 9, 1, 5, 6]
    print("排序前:", data)
    print("排序后:", bubble_sort(data))
