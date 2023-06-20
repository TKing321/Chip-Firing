from networkx.generators.nonisomorphic_trees import nonisomorphic_trees
import multiprocessing as mp
import matplotlib.pyplot as plt
from networkx.drawing.nx_pydot import graphviz_layout
import pydot
import networkx as nx

def label(tree, vertices, i, labels):
    if len(vertices) == 1:
        labels[vertices[0]] = i
        weights = []
        for edge in tree.edges:
            weights.append(abs(labels[edge[0]] - labels[edge[1]]))
        return len(weights) == len(set(weights))
    for v in vertices:
        # Assign next label and call
        labels[v]=i
        left_verts = [l for l in vertices if l is not v]
        if label(tree, left_verts, i + 1, labels):
            return True
    return False

def check_tree(tree):
    for n in tree.nodes:
        dic = {n: 1}
        verts = [no for no in tree.nodes if no is not n]
        if not label(tree, verts, 2, dic):
            print(dic)
            print(tree.edges)
            return False
    return True

if __name__ == '__main__':
    n = 12

    for i in range(2,n+1):
        pool = mp.Pool(mp.cpu_count())
        trees = list(nonisomorphic_trees(i))

        results = pool.map(check_tree, [tree for tree in trees])

        pool.close()
        print(results)
