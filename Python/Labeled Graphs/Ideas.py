import random

def initialize(k):
    graph = []

    for i in range(2 * k + 1):
        graph.append([])

    for i in range(2 * k + 1):
        graph[k].append(i)

    return graph

def selectRandom(o, n):
    # print("Random", o, n)
    return random.sample(o, n)

def findValidVertex(g):
    valid = []
    for v in range(len(g)):
        if len(g[v]) > 1:
            valid.append(v)
    return valid

def fire(g):
    valid = findValidVertex(g)
    while len(valid) > 0:
        i = selectRandom(valid, 1)[0]
        c = selectRandom(g[i], 2)
        a, b = c[0], c[1]

        if a > b:
            g[i-1].append(b)
            g[i+1].append(a)
        else:
            g[i - 1].append(a)
            g[i + 1].append(b)
        g[i].remove(a)
        g[i].remove(b)
        valid = findValidVertex(g)
    return sorted(g)

def printGraph(g):
    print(g)

def sorted(g):
    return all(b >= a for a, b in zip(g, g[1:]))

def test(n, k):
    total = 0
    for i in range(n):
        print(i)
        graph = initialize(k)
        s = fire(graph)
        if s:
            total+=1
    print(total/n)

test(100, 200)

# TODO: Set up a system that fires the center until 3, and then the rightmost option after that. This should cause problems but I am not quite sure.
