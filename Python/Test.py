import math

import numpy as np
from Firing_Code.onegraph import Graph
import time


# n = 100
#
# graph2 = Graph()
# graph2.build_graph(n)
# graph2.calc_identity()
# vertices = graph2.get_vertices()
# for v in vertices:
#     print(v.get_value())
#
# values = []
# for v in vertices:
#     values.append(v.get_value())
# values = np.array(values).reshape(n, n)
# print(values)

# .43116644701511087
# n = 4
# trials = 100000
#
# accuracy = {}
# for i in range(2 ** n + 1):
#     accuracy[i + 1] = 0
#
# start_time = time.time()
# for i in range(trials):
#     graph = Graph(2 ** n + 1)
#     graph.stabilize()
#     v = graph.vertices
#     for j in range(len(v)):
#         if v[j].get_value()[0] != j+1:
#             accuracy[j + 1] += 1
# print(accuracy.values())
# print("--- %s seconds ---" % (time.time() - start_time))


def sigmoid(x):
    return 1 / (1 + math.exp(-x))


print(sigmoid(0))
